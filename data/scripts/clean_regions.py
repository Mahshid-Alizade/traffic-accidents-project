from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine


PROCESSED_DIR = Path("data/cleaned_data")
REGION_DIR = Path("data/raw_data/region")

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


def locate_region_files():
    """
    Collect all available regional reference files.
    """
    return sorted(
        REGION_DIR.glob("*.xlsx")
    )


def determine_sheet_name(workbook_path):
    """
    Select the worksheet containing the actual region data.
    """
    workbook = pd.ExcelFile(workbook_path)

    return next(
        sheet
        for sheet in workbook.sheet_names
        if sheet != "Inhalt"
    )


def standardize_columns(frame, file_name):
    """
    Harmonize column names across yearly file formats.
    """

    # The 2016 workbook uses different coordinate column names.
    if "2016" in file_name:
        return frame.rename(
            columns={
                "Unnamed: 7": "region_name",
                "Unnamed: 14": "longitude",
                "Unnamed: 15": "latitude"
            }
        )

    return frame.rename(
        columns={
            "Unnamed: 7": "region_name",
            "Längengrad": "longitude",
            "Breitengrad": "latitude"
        }
    )


def create_ags_identifier(frame):
    """
    Build the AGS code from its individual components.
    """

    state = (
        frame["Land"]
        .fillna("00")
        .astype(str)
        .str.strip()
        .str.zfill(2)
    )

    district = (
        frame["RB"]
        .fillna("0")
        .astype(str)
        .str.strip()
        .replace("", "0")
    )

    county = (
        frame["Kreis"]
        .fillna("00")
        .astype(str)
        .str.strip()
        .replace("", "00")
        .str.zfill(2)
    )

    return state + district + county


def normalize_coordinates(frame):
    """
    Convert coordinate values into numeric format.
    """

    frame["longitude"] = (
        frame["longitude"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )

    frame["latitude"] = (
        frame["latitude"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )

    frame["longitude"] = pd.to_numeric(
        frame["longitude"],
        errors="coerce"
    )

    frame["latitude"] = pd.to_numeric(
        frame["latitude"],
        errors="coerce"
    )

    return frame


def fill_missing_coordinates(frame):
    """
    Propagate known coordinates within the same AGS group.
    """

    frame["longitude"] = (
        frame.groupby("ags")["longitude"]
        .transform(
            lambda values: values.ffill().bfill()
        )
    )

    frame["latitude"] = (
        frame.groupby("ags")["latitude"]
        .transform(
            lambda values: values.ffill().bfill()
        )
    )

    return frame


def process_region_file(file_path):

    print(f"\nReading file: {file_path}")

    try:

        # Determine which worksheet contains the region information.
        selected_sheet = determine_sheet_name(
            file_path
        )

        print("Sheet:", selected_sheet)

        # Load the selected worksheet.
        data = pd.read_excel(
            file_path,
            sheet_name=selected_sheet,
            header=3,
            dtype=str
        )

        data = standardize_columns(
            data,
            str(file_path)
        )

        # Retain only rows that contain valid state codes.
        data = data[
            data["Land"]
            .astype(str)
            .str.match(
                r"^\d+$",
                na=False
            )
        ]

        data["ags"] = create_ags_identifier(
            data
        )

        data = normalize_coordinates(
            data
        )

        data = fill_missing_coordinates(
            data
        )

        # Keep only the attributes required for downstream processing.
        data = data[
            [
                "ags",
                "region_name",
                "longitude",
                "latitude"
            ]
        ]

        print(
            f"Rows loaded: {len(data)}"
        )

        return data

    except Exception as exc:

        print(
            f"Failed to process {file_path}"
        )
        print(exc)

        return None


def build_region_dataset():

    files = locate_region_files()

    print("Found files:")
    print(files)

    datasets = []

    for file_path in files:

        processed = process_region_file(
            file_path
        )

        if processed is not None:
            datasets.append(processed)

    # Combine all yearly datasets into a single dataframe.
    merged = pd.concat(
        datasets,
        ignore_index=True
    )

    # Remove entries where coordinates could not be determined.
    merged = merged.dropna(
        subset=[
            "longitude",
            "latitude"
        ]
    )

    # Ensure each AGS appears only once.
    merged = merged.drop_duplicates(
        subset=["ags"]
    )

    # Rebuild the index after filtering operations.
    merged = merged.reset_index(
        drop=True
    )

    # Arrange regions in AGS order.
    merged = merged.sort_values(
        by="ags"
    )

    return merged


def export_regions(frame):

    # Save the cleaned region reference dataset.
    destination = (
        PROCESSED_DIR /
        "regions_cleaned.csv"
    )

    frame.to_csv(
        destination,
        index=False
    )

    return destination


def print_summary(frame, output_file):

    # Display a brief overview of the generated dataset.
    print(
        "\nProcessed dataset created successfully."
    )

    print(
        "\nUnique AGS:",
        frame["ags"].nunique()
    )

    print(
        "Total rows:",
        len(frame)
    )

    print(
        "\nSaved to:",
        output_file
    )


def upload_regions(frame):

    # Store the final region dataset in PostgreSQL.
    password = "tazoolae3Xei"

    engine = create_engine(
        f"postgresql://traffic_accidents_rw:{password}"
        "@pgsql.hrz.tu-chemnitz.de:5432/traffic_accidents"
    )

    frame.to_sql(
        "regions",
        engine,
        if_exists="append",
        index=False,
        chunksize=1000
    )

    print(
        f"\nRegions imported successfully ({len(frame)} rows)."
    )


def main():

    regions_df = build_region_dataset()

    output_file = export_regions(
        regions_df
    )

    print_summary(
        regions_df,
        output_file
    )

    upload_regions(
        regions_df
    )


if __name__ == "__main__":
    main()