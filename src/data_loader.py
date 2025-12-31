"""
Data loading module for PCA dashboard.
Handles CSV file loading and preprocessing of numeric features.
"""

import pandas as pd
import numpy as np
from typing import Tuple, Optional


def load_data(filepath: str) -> pd.DataFrame:
    """
    Load data from a CSV file.
    
    Args:
        filepath: Path to the CSV file
        
    Returns:
        DataFrame containing the loaded data
    """
    try:
        df = pd.read_csv(filepath)
        return df
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {filepath}")
    except Exception as e:
        raise Exception(f"Error loading file: {str(e)}")


def extract_numeric_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract only numeric columns from the dataframe.
    
    Args:
        df: Input dataframe
        
    Returns:
        DataFrame containing only numeric columns
    """
    numeric_df = df.select_dtypes(include=[np.number])
    return numeric_df


def identify_label_column(df: pd.DataFrame, numeric_df: pd.DataFrame) -> Optional[str]:
    """
    Identify a potential categorical label column for coloring.
    Looks for non-numeric columns that could be used as labels.
    
    Args:
        df: Original dataframe
        numeric_df: DataFrame with only numeric columns
        
    Returns:
        Name of label column if found, None otherwise
    """
    non_numeric_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    
    # Look for columns that might be labels (categorical, not too many unique values)
    for col in non_numeric_cols:
        if df[col].nunique() <= 20:  # Reasonable number of categories
            return col
    
    return None


def prepare_data_from_dataframe(df: pd.DataFrame) -> Tuple[pd.DataFrame, Optional[str], pd.DataFrame]:
    """
    Complete data preparation pipeline from a DataFrame.
    
    Args:
        df: Input DataFrame
        
    Returns:
        Tuple of (numeric_features_df, label_column_name, original_df)
    """
    # Extract numeric features
    numeric_df = extract_numeric_features(df)
    
    if numeric_df.empty:
        raise ValueError("No numeric columns found in the dataset")
    
    # Identify label column
    label_col = identify_label_column(df, numeric_df)
    
    return numeric_df, label_col, df


def prepare_data(filepath: str) -> Tuple[pd.DataFrame, Optional[str], pd.DataFrame]:
    """
    Complete data preparation pipeline.
    
    Args:
        filepath: Path to the CSV file
        
    Returns:
        Tuple of (numeric_features_df, label_column_name, original_df)
    """
    # Load data
    df = load_data(filepath)
    
    # Use the DataFrame-based preparation
    return prepare_data_from_dataframe(df)

