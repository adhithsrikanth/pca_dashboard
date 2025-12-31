import argparse
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'src'))

from data_loader import prepare_data
from pca_analyzer import standardize_data, compute_pca, get_variance_metrics
from visualizer import create_dashboard
import matplotlib.pyplot as plt


def print_summary(results: dict):
    print("\n" + "="*60)
    print("PCA ANALYSIS SUMMARY")
    print("="*60)
    print(f"Original features: {len(results['feature_names'])}")
    print(f"Principal components: {results['n_components']}")
    print(f"Label column: {results['label_column'] if results['label_column'] else 'None found'}")
    print("\nTop 10 Components - Explained Variance:")
    print("-" * 60)
    
    top_n = min(10, results['n_components'])
    for i in range(top_n):
        var_pct = results['explained_variance_ratio'][i] * 100
        cum_var_pct = results['cumulative_variance'][i] * 100
        print(f"PC{i+1:2d}: {var_pct:6.2f}% (Cumulative: {cum_var_pct:6.2f}%)")
    
    cum_var = results['cumulative_variance']
    idx_80 = next((i for i, v in enumerate(cum_var) if v >= 0.80), None)
    idx_95 = next((i for i, v in enumerate(cum_var) if v >= 0.95), None)
    
    print("\n" + "-" * 60)
    if idx_80 is not None:
        print(f"Components needed for 80% variance: {idx_80 + 1}")
    if idx_95 is not None:
        print(f"Components needed for 95% variance: {idx_95 + 1}")
    print("="*60 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='PCA Dashboard: Dimensionality Reduction and Variance Analysis',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python dashboard.py data/sample_data.csv
  python dashboard.py data/sample_data.csv --components 5
  python dashboard.py data/sample_data.csv --components 10 --save outputs/
        """
    )
    
    parser.add_argument('data_file', 
                       type=str,
                       help='Path to CSV file containing numeric features')
    
    parser.add_argument('--components', '-n',
                       type=int,
                       default=None,
                       help='Number of principal components to retain (default: all)')
    
    parser.add_argument('--show-components', '-s',
                       type=int,
                       default=None,
                       help='Number of components to display in plots (default: all)')
    
    parser.add_argument('--save',
                       type=str,
                       default=None,
                       help='Directory to save visualization figures')
    
    parser.add_argument('--no-display',
                       action='store_true',
                       help='Do not display plots interactively (useful when saving)')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.data_file):
        print(f"Error: File not found: {args.data_file}")
        sys.exit(1)
    
    if args.save:
        os.makedirs(args.save, exist_ok=True)
    
    try:
        print("Loading data...")
        numeric_df, label_col, original_df = prepare_data(args.data_file)
        print(f"Loaded {len(numeric_df)} rows with {len(numeric_df.columns)} numeric features")
        
        if label_col:
            print(f"Found label column: {label_col}")
        
        print("Standardizing data...")
        standardized_data = standardize_data(numeric_df)
        
        print(f"Applying PCA{' with ' + str(args.components) + ' components' if args.components else ''}...")
        pca, transformed_data = compute_pca(standardized_data, args.components)
        
        explained_variance_ratio, cumulative_variance = get_variance_metrics(pca)
        
        results = {
            'pca': pca,
            'transformed_data': transformed_data,
            'explained_variance_ratio': explained_variance_ratio,
            'cumulative_variance': cumulative_variance,
            'n_components': pca.n_components_,
            'feature_names': numeric_df.columns.tolist(),
            'label_column': label_col,
            'labels': original_df[label_col].values if label_col else None,
            'original_data': numeric_df
        }
        
        print_summary(results)
        
        print("Creating visualizations...")
        n_show = args.show_components if args.show_components else results['n_components']
        figs = create_dashboard(results, n_components_to_show=n_show, save_dir=args.save)
        
        if args.save:
            print(f"Figures saved to {args.save}/")
        
        if not args.no_display:
            print("Displaying plots...")
            plt.show()
        else:
            plt.close('all')
            print("Analysis complete!")
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
