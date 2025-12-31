import pandas as pd
import numpy as np
from typing import Tuple, Optional


def load_data(filepath: str) -> pd.DataFrame:
    try:
        df = pd.read_csv(filepath)
        return df
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {filepath}")
    except Exception as e:
        raise Exception(f"Error loading file: {str(e)}")


def extract_numeric_features(df: pd.DataFrame) -> pd.DataFrame:
    numeric_df = df.select_dtypes(include=[np.number])
    return numeric_df


def identify_label_column(df: pd.DataFrame, numeric_df: pd.DataFrame) -> Optional[str]:
    non_numeric_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    
    for col in non_numeric_cols:
        if df[col].nunique() <= 20:
            return col
    
    return None


def prepare_data_from_dataframe(df: pd.DataFrame) -> Tuple[pd.DataFrame, Optional[str], pd.DataFrame]:
    numeric_df = extract_numeric_features(df)
    
    if numeric_df.empty:
        raise ValueError("No numeric columns found in the dataset")
    
    label_col = identify_label_column(df, numeric_df)
    
    return numeric_df, label_col, df


def prepare_data(filepath: str) -> Tuple[pd.DataFrame, Optional[str], pd.DataFrame]:
    df = load_data(filepath)
    
    return prepare_data_from_dataframe(df)
