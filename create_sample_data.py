"""
Script to create a sample dataset for PCA demonstration.
Creates a dataset with multiple numeric features and optional categorical labels.
"""

import numpy as np
import pandas as pd
import os


def create_sample_dataset(n_samples=200, n_features=10, n_classes=3, output_path='data/sample_data.csv'):
    """
    Create a sample dataset with multiple numeric features and categorical labels.
    
    Args:
        n_samples: Number of data points
        n_features: Number of numeric features
        n_classes: Number of categories for the label column
        output_path: Path to save the CSV file
    """
    np.random.seed(42)  # For reproducibility
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Generate correlated features to make PCA meaningful
    # Create features with different scales and correlations
    data = {}
    
    # Feature group 1: Highly correlated features (will form first PC)
    for i in range(3):
        base = np.random.randn(n_samples)
        noise = np.random.randn(n_samples) * 0.1
        data[f'feature_group1_{i+1}'] = base + noise
    
    # Feature group 2: Moderately correlated features (will form second PC)
    for i in range(3):
        base = np.random.randn(n_samples) * 0.8
        noise = np.random.randn(n_samples) * 0.2
        data[f'feature_group2_{i+1}'] = base + noise
    
    # Feature group 3: Less correlated features (will form later PCs)
    remaining = n_features - 6
    for i in range(remaining):
        data[f'feature_independent_{i+1}'] = np.random.randn(n_samples) * 0.5
    
    # Add some class-specific patterns
    labels = np.random.choice([f'Class_{i+1}' for i in range(n_classes)], n_samples)
    
    # Modify features based on class to create separable clusters
    for i, label in enumerate(labels):
        class_idx = int(label.split('_')[1]) - 1
        # Add class-specific offset to first few features
        data['feature_group1_1'][i] += class_idx * 2.0
        data['feature_group1_2'][i] += class_idx * 1.5
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Add label column
    df['category'] = labels
    
    # Shuffle rows
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Save to CSV
    df.to_csv(output_path, index=False)
    print(f"Sample dataset created: {output_path}")
    print(f"  - Samples: {n_samples}")
    print(f"  - Features: {n_features}")
    print(f"  - Categories: {n_classes}")
    
    return df


if __name__ == '__main__':
    create_sample_dataset()

