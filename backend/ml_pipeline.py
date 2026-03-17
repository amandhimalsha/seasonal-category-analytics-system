import pandas as pd

def run_analysis(file_path):
    """
    Read the uploaded Excel file and return basic aggregations.
    Column matching is case-insensitive and ignores surrounding whitespace
    so that common variations like 'gender', ' GENDER ', etc. still work.
    """
    df = pd.read_excel(file_path)

    # Build a lookup from normalized name -> original column name
    normalized_cols = {col.strip().lower(): col for col in df.columns}

    results = {}

    # Helper to safely aggregate by a logical column name
    def add_value_counts(logical_name, output_key=None):
        key = logical_name.strip().lower()
        if key in normalized_cols:
            original = normalized_cols[key]
            counts = df[original].value_counts().to_dict()
            results[output_key or original] = counts

    add_value_counts("Gender", "Gender")
    add_value_counts("Location", "Location")
    add_value_counts("Season", "Season")
    add_value_counts("Age", "Age")

    return results
