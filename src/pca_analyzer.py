import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Optional


def standardize_data(data: pd.DataFrame) -> np.ndarray:
    scaler = StandardScaler()
    standardized_data = scaler.fit_transform(data)
    return standardized_data


def compute_pca(data: np.ndarray, n_components: Optional[int] = None) -> Tuple[PCA, np.ndarray]:
    pca = PCA(n_components=n_components)
    transformed_data = pca.fit_transform(data)
    return pca, transformed_data


def get_variance_metrics(pca: PCA) -> Tuple[np.ndarray, np.ndarray]:
    explained_variance_ratio = pca.explained_variance_ratio_
    cumulative_variance = np.cumsum(explained_variance_ratio)
    return explained_variance_ratio, cumulative_variance
