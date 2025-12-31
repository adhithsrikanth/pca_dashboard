import matplotlib.pyplot as plt
import numpy as np
from typing import Optional


def plot_explained_variance_bar(explained_variance_ratio: np.ndarray, 
                                n_components_to_show: Optional[int] = None,
                                save_path: Optional[str] = None):
    if n_components_to_show is None:
        n_components_to_show = len(explained_variance_ratio)
    
    components_to_show = min(n_components_to_show, len(explained_variance_ratio))
    variance_to_show = explained_variance_ratio[:components_to_show]
    
    fig, ax = plt.subplots(figsize=(12, 6))
    component_numbers = np.arange(1, components_to_show + 1)
    
    bars = ax.bar(component_numbers, variance_to_show * 100, 
                  color='steelblue', alpha=0.7, edgecolor='black')
    
    for i, (bar, var) in enumerate(zip(bars, variance_to_show)):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{var*100:.1f}%',
                ha='center', va='bottom', fontsize=9)
    
    ax.set_xlabel('Principal Component', fontsize=12, fontweight='bold')
    ax.set_ylabel('Explained Variance (%)', fontsize=12, fontweight='bold')
    ax.set_title('Explained Variance by Principal Component', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(component_numbers)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    
    return fig


def plot_cumulative_variance(cumulative_variance: np.ndarray,
                            n_components_to_show: Optional[int] = None,
                            save_path: Optional[str] = None):
    if n_components_to_show is None:
        n_components_to_show = len(cumulative_variance)
    
    components_to_show = min(n_components_to_show, len(cumulative_variance))
    variance_to_show = cumulative_variance[:components_to_show]
    
    fig, ax = plt.subplots(figsize=(12, 6))
    component_numbers = np.arange(1, components_to_show + 1)
    
    ax.plot(component_numbers, variance_to_show * 100, 
            marker='o', linewidth=2, markersize=8, color='darkgreen')
    
    for i, var in enumerate(variance_to_show):
        if i == 0 or i == len(variance_to_show) - 1 or i % max(1, len(variance_to_show) // 10) == 0:
            ax.text(component_numbers[i], var * 100,
                   f'{var*100:.1f}%',
                   ha='center', va='bottom', fontsize=9)
    
    ax.axhline(y=80, color='orange', linestyle='--', alpha=0.5, label='80% threshold')
    ax.axhline(y=95, color='red', linestyle='--', alpha=0.5, label='95% threshold')
    
    ax.set_xlabel('Number of Principal Components', fontsize=12, fontweight='bold')
    ax.set_ylabel('Cumulative Explained Variance (%)', fontsize=12, fontweight='bold')
    ax.set_title('Cumulative Explained Variance', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(component_numbers)
    ax.grid(alpha=0.3, linestyle='--')
    ax.legend()
    ax.set_ylim([0, 105])
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    
    return fig


def plot_pca_scatter(transformed_data: np.ndarray,
                    labels: Optional[np.ndarray] = None,
                    label_column_name: Optional[str] = None,
                    save_path: Optional[str] = None):
    if transformed_data.shape[1] < 2:
        raise ValueError("Need at least 2 principal components for scatter plot")
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    pc1 = transformed_data[:, 0]
    pc2 = transformed_data[:, 1]
    
    if labels is not None:
        unique_labels = np.unique(labels)
        colors = plt.cm.tab10(np.linspace(0, 1, len(unique_labels)))
        
        for i, label in enumerate(unique_labels):
            mask = labels == label
            ax.scatter(pc1[mask], pc2[mask], 
                      c=[colors[i]], label=str(label),
                      alpha=0.6, s=50, edgecolors='black', linewidth=0.5)
        
        ax.legend(title=label_column_name if label_column_name else 'Category',
                 fontsize=10, title_fontsize=11, loc='best')
    else:
        ax.scatter(pc1, pc2, alpha=0.6, s=50, 
                  c='steelblue', edgecolors='black', linewidth=0.5)
    
    ax.set_xlabel(f'First Principal Component (PC1)', 
                 fontsize=12, fontweight='bold')
    ax.set_ylabel(f'Second Principal Component (PC2)', 
                 fontsize=12, fontweight='bold')
    ax.set_title('2D Projection: First Two Principal Components', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.grid(alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    
    return fig


def create_dashboard(results: dict, n_components_to_show: Optional[int] = None,
                    save_dir: Optional[str] = None):
    if n_components_to_show is None:
        n_components_to_show = results['n_components']
    
    fig1 = plot_explained_variance_bar(
        results['explained_variance_ratio'],
        n_components_to_show,
        save_path=f"{save_dir}/explained_variance_bar.png" if save_dir else None
    )
    
    fig2 = plot_cumulative_variance(
        results['cumulative_variance'],
        n_components_to_show,
        save_path=f"{save_dir}/cumulative_variance.png" if save_dir else None
    )
    
    fig3 = plot_pca_scatter(
        results['transformed_data'],
        results['labels'],
        results['label_column'],
        save_path=f"{save_dir}/pca_scatter.png" if save_dir else None
    )
    
    return fig1, fig2, fig3
