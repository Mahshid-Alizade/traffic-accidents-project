from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine


PROCESSED_DIR = Path("data/cleaned_data")
RAW_DIR = Path("data/raw_data/accident")

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

COLUMN_MAPPING = {
    "UJAHR": "year",
    "UMONAT": "month",
    "USTUNDE": "hour",
    "UWOCHENTAG": "weekday",
    "UKATEGORIE": "category",
    "UART": "accident_type",
    "IstRad": "is_bicycle",
    "IstPKW": "is_car",
    "IstFuss": "is_pedestrian",
    "IstKrad": "is_motorcycle",
    "LICHT": "light_condition",
}

RELEVANT_COLUMNS = [
    "ULAND",
    "UREGBEZ",
    "UKREIS",
    "UJAHR",
    "UMONAT",
    "USTUNDE",
    "UWOCHENTAG",
    "UKATEGORIE",
    "UART",
    "IstRad",
    "IstPKW",
    "IstFuss",
    "IstKrad",
    "LICHT",
    "ULICHTVERH",
]


# Accident datasets are provided in different formats depending on the year:
# - TXT files for 2016–2019 and 2021
# - CSV files for 2020 and 2022–2024
def read_accident_data(file_path):

    print(f"\nReading file: {file_path}")

    try:
        data = pd.read_csv(
            file_path,
            sep=";",
            encoding="latin1",
            dtype=str,
            low_memory=False
        )

        # In certain exports the delimiter is not interpreted correctly,
        # causing the entire row to appear in a single column.
        if data.shape[1] == 1:

            print("Detected malformed delimiter structure. Rebuilding columns...")

            raw_header = data.columns[0]

            data = data[raw_header].str.split(
                ";",
                expand=True
            )

            data.columns = raw_header.split(";")

        return data

    except Exception as exc:
        print(f"Failed to load file: {file_path}")
        print(exc)
        return None


def generate_ags(frame):

    state_code = (
        frame["ULAND"]
        .fillna("0")
        .astype(str)
        .str.strip()
        .str.zfill(2)
    )

    district_code = (
        frame["UREGBEZ"]
        .fillna("0")
        .astype(str)
        .str.strip()
        .str.zfill(1)
    )

    county_code = (
        frame["UKREIS"]
        .fillna("0")
        .astype(str)
        .str.strip()
        .str.zfill(2)
    )

    # Construct the official administrative region identifier (AGS)
    # by combining state, administrative district, and county codes.
    # Example: 03 + 1 + 01 -> 03101
    return state_code + district_code + county_code


def unify_light_information(frame):

    # Different years use different column names for lighting conditions.
    # Consolidate both representations into a single field.
    if "ULICHTVERH" not in frame.columns:
        return frame

    if "LICHT" in frame.columns:

        frame["LICHT"] = frame["LICHT"].fillna(
            frame["ULICHTVERH"]
        )

        frame.drop(
            columns=["ULICHTVERH"],
            inplace=True
        )

    else:

        frame.rename(
            columns={
                "ULICHTVERH": "LICHT"
            },
            inplace=True
        )

    return frame


def prepare_dataset(frame):

    # Retain only the attributes required for further analysis.
    available_columns = [
        column
        for column in RELEVANT_COLUMNS
        if column in frame.columns
    ]

    frame = frame[available_columns].copy()

    frame["ags"] = generate_ags(frame)

    # The individual location components are no longer needed
    # once the AGS code has been generated.
    frame.drop(
        columns=[
            "ULAND",
            "UREGBEZ",
            "UKREIS"
        ],
        errors="ignore",
        inplace=True
    )

    frame = frame[
        frame["ags"].str.len() == 5
    ]

    frame = unify_light_information(frame)

    frame.rename(
        columns=COLUMN_MAPPING,
        inplace=True
    )

    return frame


def discover_source_files():

    txt_files = list(
        RAW_DIR.glob("*.txt")
    )

    csv_files = list(
        RAW_DIR.glob("*.csv")
    )

    return sorted(txt_files + csv_files)


def collect_accident_records():

    files = discover_source_files()

    print("Files discovered:")
    for file in files:
        print(file)

    processed_datasets = []

    for file in files:

        dataset = read_accident_data(file)

        if dataset is None:
            continue

        try:

            cleaned_dataset = prepare_dataset(dataset)

            # Store the processed dataset so it can be merged later.
            processed_datasets.append(
                cleaned_dataset
            )

            print(
                f"Rows loaded: {len(cleaned_dataset)}"
            )

        except Exception as exc:

            print(
                f"Transformation failed for {file}"
            )
            print(exc)

    # Stop execution if no valid accident records were collected.
    if not processed_datasets:
        raise ValueError(
            "No accident files were loaded."
        )

    # Combine the yearly datasets into one consolidated dataframe.
    return pd.concat(
        processed_datasets,
        ignore_index=True
    )


def load_region_reference():

    # Load the reference list of valid administrative regions.
    regions = pd.read_csv(
        PROCESSED_DIR / "regions_cleaned.csv",
        dtype={"ags": str}
    )

    return set(
        regions["ags"]
    )


def standardize_city_state_codes(frame):

    # Standardize AGS values for city-states that require special handling.
    frame.loc[
        frame["ags"].str.startswith("02"),
        "ags"
    ] = "02000"

    frame.loc[
        frame["ags"].str.startswith("110"),
        "ags"
    ] = "11000"

    return frame


def filter_invalid_regions(frame, valid_ags):

    # Remove records whose AGS code does not exist in the
    # cleaned regional reference dataset.
    before_count = len(frame)

    filtered = frame[
        frame["ags"].isin(valid_ags)
    ]

    after_count = len(filtered)

    print("\nFiltering complete")
    print("Rows before :", before_count)
    print("Rows after  :", after_count)
    print("Rows removed:", before_count - after_count)

    return filtered


def export_clean_dataset(frame):

    # Export the cleaned accident dataset for later use.
    output_file = (
        PROCESSED_DIR /
        "accidents_cleaned.csv"
    )

    frame.to_csv(
        output_file,
        index=False
    )

    print("\nSaved cleaned file:")
    print(output_file)

    return output_file


def write_to_database(frame):

    # Persist the final dataset to the PostgreSQL database.
    password = "tazoolae3Xei"

    engine = create_engine(
        f"postgresql://traffic_accidents_rw:{password}"
        "@pgsql.hrz.tu-chemnitz.de:5432/traffic_accidents"
    )

    frame.to_sql(
        "accidents",
        engine,
        if_exists="append",
        index=False,
        chunksize=10000
    )

    print(
        "\nAccident data imported successfully."
    )


def main():

    accidents_df = collect_accident_records()

    print("\nMerged accident records:")
    print(len(accidents_df))

    valid_ags = load_region_reference()

    accidents_df = standardize_city_state_codes(
        accidents_df
    )

    print(
        accidents_df[
            accidents_df["ags"].str.startswith("02")
        ]["ags"].unique()
    )

    accidents_df = filter_invalid_regions(
        accidents_df,
        valid_ags
    )

    export_clean_dataset(
        accidents_df
    )

    write_to_database(
        accidents_df
    )


if __name__ == "__main__":
    main()