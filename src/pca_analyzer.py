"""
PCA analysis module for dimensionality reduction and variance analysis.
"""

import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Optional


def standardize_data(data: pd.DataFrame) -> np.ndarray:
    """
    Standardize the data using z-score normalization.
    
    Args:
        data: DataFrame with numeric features
        
    Returns:
        Standardized data as numpy array
    """
    scaler = StandardScaler()
    standardized_data = scaler.fit_transform(data)
    return standardized_data


def compute_pca(data: np.ndarray, n_components: Optional[int] = None) -> Tuple[PCA, np.ndarray]:
    """
    Apply PCA to the standardized data.
    
    Args:
        data: Standardized data array
        n_components: Number of components to retain (None for all)
        
    Returns:
        Tuple of (fitted PCA object, transformed data)
    """
    pca = PCA(n_components=n_components)
    transformed_data = pca.fit_transform(data)
    return pca, transformed_data


def get_variance_metrics(pca: PCA) -> Tuple[np.ndarray, np.ndarray]:
    """
    Compute explained variance metrics.
    
    Args:
        pca: Fitted PCA object
        
    Returns:
        Tuple of (explained_variance_ratio, cumulative_explained_variance)
    """
    explained_variance_ratio = pca.explained_variance_ratio_
    cumulative_variance = np.cumsum(explained_variance_ratio)
    return explained_variance_ratio, cumulative_variance



