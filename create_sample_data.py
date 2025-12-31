import numpy as np
import pandas as pd
import os


def create_sample_dataset(n_samples=200, n_features=10, n_classes=3, output_path='data/sample_data.csv'):
    np.random.seed(42)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    data = {}
    
    for i in range(3):
        base = np.random.randn(n_samples)
        noise = np.random.randn(n_samples) * 0.1
        data[f'feature_group1_{i+1}'] = base + noise
    
    for i in range(3):
        base = np.random.randn(n_samples) * 0.8
        noise = np.random.randn(n_samples) * 0.2
        data[f'feature_group2_{i+1}'] = base + noise
    
    remaining = n_features - 6
    for i in range(remaining):
        data[f'feature_independent_{i+1}'] = np.random.randn(n_samples) * 0.5
    
    labels = np.random.choice([f'Class_{i+1}' for i in range(n_classes)], n_samples)
    
    for i, label in enumerate(labels):
        class_idx = int(label.split('_')[1]) - 1
        data['feature_group1_1'][i] += class_idx * 2.0
        data['feature_group1_2'][i] += class_idx * 1.5
    
    df = pd.DataFrame(data)
    
    df['category'] = labels
    
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    df.to_csv(output_path, index=False)
    print(f"Sample dataset created: {output_path}")
    print(f"  - Samples: {n_samples}")
    print(f"  - Features: {n_features}")
    print(f"  - Categories: {n_classes}")
    
    return df


if __name__ == '__main__':
    create_sample_dataset()
