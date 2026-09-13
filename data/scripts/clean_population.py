from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine


PROCESSED_DIR = Path("data/cleaned_data")
RAW_FILE = Path("data/raw_data/population.csv")


def load_population_source():
    """
    Read the raw population dataset.
    """
    return pd.read_csv(
        RAW_FILE,
        sep=";",
        dtype=str
    )


def load_region_codes():
    """
    Load the list of accepted AGS identifiers.
    """
    regions = pd.read_csv(
        PROCESSED_DIR / "regions_cleaned.csv",
        dtype={"ags": str}
    )

    return set(regions["ags"])


def extract_population_records(source_df, allowed_ags):

    extracted_records = []

    # Iterate through all entries and keep only records
    # that satisfy the required quality checks.
    for _, record in source_df.iterrows():

        try:
            ags_code = str(
                record["1_variable_attribute_code"]
            ).strip()

            population_value = str(
                record["value"]
            ).strip()

            timestamp = str(
                record["time"]
            ).strip()

        except Exception:
            continue

        # Ignore observations where population data is unavailable.
        if population_value == "-":
            continue

        # Derive the reporting year from the timestamp field.
        try:
            reporting_year = int(
                timestamp[:4]
            )
        except ValueError:
            continue

        # Retain only records that belong to known regions.
        if ags_code not in allowed_ags:
            continue

        try:
            population_total = int(
                population_value
            )
        except ValueError:
            continue

        extracted_records.append(
            {
                "ags": ags_code,
                "year": reporting_year,
                "population_total": population_total
            }
        )

    return extracted_records


def build_population_dataframe(records):

    # Convert the validated records into a dataframe.
    population_df = pd.DataFrame(records)

    # Ensure there is only one record per AGS and year.
    population_df = population_df.drop_duplicates(
        subset=["ags", "year"]
    )

    # Arrange records in a predictable order.
    population_df = (
        population_df
        .sort_values(
            by=["ags", "year"]
        )
        .reset_index(drop=True)
    )

    return population_df


def print_validation_summary(frame):

    # Display a few integrity checks before exporting.
    print(
        "Duplicate (ags, year):",
        frame.duplicated(
            subset=["ags", "year"]
        ).sum()
    )

    print(
        "Unique AGS:",
        frame["ags"].nunique()
    )

    print(
        "Rows:",
        len(frame)
    )


def save_cleaned_dataset(frame):

    # Write the cleaned population data to disk.
    destination = (
        PROCESSED_DIR /
        "population_cleaned.csv"
    )

    frame.to_csv(
        destination,
        index=False
    )

    print("\nSaved:")
    print(destination)

    return destination


def upload_population_data(frame):

    # Insert the final dataset into PostgreSQL.
    password = "tazoolae3Xei"

    db_engine = create_engine(
        f"postgresql://traffic_accidents_rw:{password}"
        "@pgsql.hrz.tu-chemnitz.de:5432/traffic_accidents"
    )

    frame.to_sql(
        "population",
        db_engine,
        if_exists="append",
        index=False,
        chunksize=10000
    )

    print(
        f"\nPopulation data imported successfully ({len(frame)} rows)."
    )


def main():

    # Read source population data.
    population_source = load_population_source()

    # Load the reference AGS catalogue.
    valid_ags = load_region_codes()

    # Extract and validate population records.
    records = extract_population_records(
        population_source,
        valid_ags
    )

    # Create the final dataframe.
    cleaned_df = build_population_dataframe(
        records
    )

    # Run basic validation checks.
    print_validation_summary(
        cleaned_df
    )

    # Export the processed dataset.
    save_cleaned_dataset(
        cleaned_df
    )

    # Persist the dataset to the database.
    upload_population_data(
        cleaned_df
    )


if __name__ == "__main__":
    main()