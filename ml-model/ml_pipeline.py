from google.colab import drive
drive.mount('/content/drive')

# Step 1: Install required packages (if not already installed)
!pip install openpyxl seaborn plotly --quiet

# Step 2: Import libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from google.colab import files

# Step 3: Upload Excel file manually
print("Upload your Excel file now")
uploaded = files.upload()

# Get the first uploaded file name
file_name = list(uploaded.keys())[0]
print(f"Uploaded file: {file_name}")

# Step 4: Read the Excel file
df = pd.read_excel(file_name)
print("Data preview:")
print(df.head())

# Step 5: Basic preprocessing
numeric_cols = df.select_dtypes(include='number').columns.tolist()
categorical_cols = df.select_dtypes(include='object').columns.tolist()
date_cols = df.select_dtypes(include='datetime64').columns.tolist()

# Try to parse any 'Date' column as datetime
for col in df.columns:
    if 'date' in col.lower():
        df[col] = pd.to_datetime(df[col], errors='coerce')
        if col not in date_cols:
            date_cols.append(col)

print(f"\nNumeric columns: {numeric_cols}")
print(f"Categorical columns: {categorical_cols}")
print(f"Date columns: {date_cols}")

# Step 6: Feature engineering (if Date column exists)
if date_cols:
    date_col = date_cols[0]
    df['Month'] = df[date_col].dt.month
    df['DayOfWeek'] = df[date_col].dt.dayofweek
    df['Quarter'] = df[date_col].dt.quarter

# Step 7: Visualizations

# Numeric columns - distribution plots
for col in numeric_cols:
    plt.figure(figsize=(8,4))
    sns.histplot(df[col], kde=True)
    plt.title(f'Distribution of {col}')
    plt.show()

# Categorical columns - count plots
for col in categorical_cols:
    plt.figure(figsize=(8,4))
    sns.countplot(y=df[col], order=df[col].value_counts().index)
    plt.title(f'Count of {col}')
    plt.show()

# Seasonal analysis by Month
if 'Month' in df.columns and numeric_cols:
    for col in numeric_cols:
        monthly_sales = df.groupby('Month')[col].sum()
        plt.figure(figsize=(8,4))
        monthly_sales.plot(marker='o')
        plt.title(f'Monthly total of {col}')
        plt.xlabel('Month')
        plt.ylabel(f'Total {col}')
        plt.grid(True)
        plt.show()

!pip install openpyxl seaborn plotly --quiet

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from google.colab import files

uploaded = files.upload()

from google.colab import drive
drive.mount('/content/drive')

import pandas as pd

# Use the uploaded file directly
df = pd.read_excel("sample doc 1.xlsx")

# Preview the first 5 rows
df.head()

# Step 0: Install required packages
!pip install openpyxl seaborn plotly --quiet

# Step 1: Import libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from google.colab import files

# Step 2: Upload Excel file manually
print("Upload your Excel file now")
uploaded = files.upload()

# Get the uploaded file name
file_name = list(uploaded.keys())[0]
print(f"Uploaded file: {file_name}")

# Step 3: Read Excel into DataFrame
df = pd.read_excel(file_name)
print("Data preview:")
display(df.head())

# Step 4: Detect column types
numeric_cols = df.select_dtypes(include='number').columns.tolist()
categorical_cols = df.select_dtypes(include='object').columns.tolist()
date_cols = df.select_dtypes(include='datetime64').columns.tolist()

# Try to parse any column with "date" in its name
for col in df.columns:
    if 'date' in col.lower():
        df[col] = pd.to_datetime(df[col], errors='coerce')
        if col not in date_cols:
            date_cols.append(col)

print(f"\nNumeric columns: {numeric_cols}")
print(f"Categorical columns: {categorical_cols}")
print(f"Date columns: {date_cols}")

# Step 5: Feature engineering for seasonal analysis
if date_cols:
    date_col = date_cols[0]  # Take first detected date column
    df['Month'] = df[date_col].dt.month
    df['DayOfWeek'] = df[date_col].dt.dayofweek
    df['Quarter'] = df[date_col].dt.quarter

# Step 6: Visualizations

# 6a: Numeric columns - distributions
for col in numeric_cols:
    plt.figure(figsize=(8,4))
    sns.histplot(df[col], kde=True)
    plt.title(f'Distribution of {col}')
    plt.show()

# 6b: Categorical columns - counts
for col in categorical_cols:
    plt.figure(figsize=(8,4))
    sns.countplot(y=df[col], order=df[col].value_counts().index)
    plt.title(f'Count of {col}')
    plt.show()

# 6c: Monthly / Seasonal analysis (for numeric columns)
if 'Month' in df.columns and numeric_cols:
    for col in numeric_cols:
        monthly_data = df.groupby('Month')[col].sum()
        plt.figure(figsize=(8,4))
        monthly_data.plot(marker='o')
        plt.title(f'Monthly total of {col}')
        plt.xlabel('Month')
        plt.ylabel(f'Total {col}')
        plt.grid(True)
        plt.show()

# Step 7: Optional - Save processed data
processed_file_name = "processed_data.xlsx"
df.to_excel(processed_file_name, index=False)
print(f"Processed data saved as {processed_file_name}")

# Download processed file
files.download(processed_file_name)

# Step 0: Install required packages
!pip install openpyxl seaborn plotly --quiet

# Step 1: Import libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from google.colab import files
import glob

# --------------------------------------
# Step 2a: Upload a single Excel file manually
print("Upload your Excel file now")
uploaded = files.upload()
file_name = list(uploaded.keys())[0]
print(f"Uploaded file: {file_name}")

# Step 2b (Optional): Process multiple Excel files from Drive folder
# Example: all Excel files in '/content/drive/My Drive/ML_Project/'
# Uncomment below if you have multiple files
# all_files = glob.glob('/content/drive/My Drive/ML_Project/*.xlsx')
# df_list = [pd.read_excel(f) for f in all_files]
# df = pd.concat(df_list, ignore_index=True)

# --------------------------------------
# Step 3: Read the single uploaded Excel file
df = pd.read_excel(file_name)
print("Data preview:")
display(df.head())

# Step 4: Standardize column names (lowercase, underscores)
df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

# Step 5: Detect column types
numeric_cols = df.select_dtypes(include='number').columns.tolist()
categorical_cols = df.select_dtypes(include='object').columns.tolist()
date_cols = df.select_dtypes(include='datetime64').columns.tolist()

# Try to parse any column containing "date"
for col in df.columns:
    if 'date' in col.lower():
        df[col] = pd.to_datetime(df[col], errors='coerce')
        if col not in date_cols:
            date_cols.append(col)

print(f"\nNumeric columns: {numeric_cols}")
print(f"Categorical columns: {categorical_cols}")
print(f"Date columns: {date_cols}")

# Step 6: Feature engineering for seasonal analysis
if date_cols:
    date_col = date_cols[0]  # Take first detected date column
    df['month'] = df[date_col].dt.month
    df['day_of_week'] = df[date_col].dt.dayofweek
    df['quarter'] = df[date_col].dt.quarter

# Step 7: Visualizations

# 7a: Numeric columns - distributions
for col in numeric_cols:
    plt.figure(figsize=(8,4))
    sns.histplot(df[col], kde=True)
    plt.title(f'Distribution of {col}')
    plt.show()

# 7b: Categorical columns - counts
for col in categorical_cols:
    plt.figure(figsize=(8,4))
    sns.countplot(y=df[col], order=df[col].value_counts().index)
    plt.title(f'Count of {col}')
    plt.show()

# 7c: Monthly / Seasonal analysis (for numeric columns)
if 'month' in df.columns and numeric_cols:
    for col in numeric_cols:
        monthly_data = df.groupby('month')[col].sum()
        plt.figure(figsize=(8,4))
        monthly_data.plot(marker='o')
        plt.title(f'Monthly total of {col}')
        plt.xlabel('Month')
        plt.ylabel(f'Total {col}')
        plt.grid(True)
        plt.show()

# Step 8: Optional - Save processed data
processed_file_name = "processed_data.xlsx"
df.to_excel(processed_file_name, index=False)
print(f"Processed data saved as {processed_file_name}")

# Optional: Download processed file
files.download(processed_file_name)
