# PCA Dashboard: Dimensionality Reduction and Variance Analysis

A comprehensive dashboard for analyzing high-dimensional numeric data using Principal Component Analysis (PCA). This tool helps reveal dominant patterns in your data by reducing dimensionality while preserving the most important information.

## What is PCA?

**Principal Component Analysis (PCA)** is a powerful dimensionality reduction technique that:

1. **Identifies patterns** in high-dimensional data by finding directions (principal components) where the data varies the most
2. **Reduces complexity** by transforming many correlated features into fewer uncorrelated components
3. **Preserves variance** by keeping the components that explain the most variation in the data
4. **Enables visualization** of high-dimensional data in 2D or 3D space

### Key Concepts

- **Principal Components (PCs)**: New axes that are linear combinations of original features, ordered by how much variance they explain
- **Explained Variance**: The percentage of total variance in the data captured by each component
- **Cumulative Variance**: The total variance explained by the first N components combined
- **Standardization**: Normalizing features to have zero mean and unit variance (critical for PCA)

### What Insights Does This Dashboard Provide?

1. **Variance Distribution**: See how much information each principal component captures
2. **Dimensionality Reduction**: Determine how many components you need to retain (e.g., 80% or 95% of variance)
3. **Data Patterns**: Visualize relationships and clusters in 2D space that may not be visible in high dimensions
4. **Feature Relationships**: Understand which original features contribute most to each component

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd pca_dashboard
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create a sample dataset (optional, for testing)**:
   ```bash
   python create_sample_data.py
   ```
   This creates `data/sample_data.csv` with 200 samples, 10 features, and 3 categories.

## Usage

### 🌐 Interactive Web Dashboard (Recommended)

Launch the Streamlit web dashboard for an interactive experience:

```bash
streamlit run streamlit_dashboard.py
```

This opens a web interface in your browser where you can:
- **Upload CSV files** directly through the interface
- **Configure PCA settings** with interactive controls
- **View interactive visualizations** with zoom, pan, and hover details
- **Download results** as CSV files
- **Explore your data** with real-time updates

**Try it with the sample dataset** - just upload `data/sample_data.csv` through the interface!

### 📊 Command-Line Interface

Alternatively, run the dashboard from the command line:

```bash
python dashboard.py data/your_data.csv
```

**Try it with the sample dataset**:
```bash
python dashboard.py data/sample_data.csv
```

### Advanced Options

```bash
# Retain only the first 5 principal components
python dashboard.py data/your_data.csv --components 5

# Show only first 10 components in plots
python dashboard.py data/your_data.csv --show-components 10

# Save visualization figures to a directory
python dashboard.py data/your_data.csv --save outputs/

# Save without displaying plots interactively
python dashboard.py data/your_data.csv --save outputs/ --no-display
```

#### Command-Line Arguments

- `data_file`: Path to CSV file (required)
- `--components` / `-n`: Number of principal components to compute (default: all)
- `--show-components` / `-s`: Number of components to display in plots (default: all)
- `--save`: Directory to save visualization figures
- `--no-display`: Don't display plots interactively

## Data Format

Your CSV file should contain:
- **Multiple numeric columns** (features) - these will be used for PCA
- **Optional categorical column** - if present, points will be colored by category in the scatter plot
- **Non-numeric columns** (except potential label columns) are automatically ignored

### Example Data Structure

```csv
feature1,feature2,feature3,feature4,label
2.5,3.1,1.2,4.5,CategoryA
3.2,2.8,1.5,4.2,CategoryA
1.9,3.5,1.1,4.8,CategoryB
...
```

## Output

The dashboard provides:

1. **Console Summary**: 
   - Number of original features and components
   - Explained variance for each component
   - Components needed for 80% and 95% variance thresholds

2. **Three Visualizations**:
   - **Bar Chart**: Explained variance per principal component
   - **Line Chart**: Cumulative explained variance (with 80% and 95% thresholds)
   - **Scatter Plot**: 2D projection using the first two principal components (colored by category if available)

3. **Saved Figures** (if `--save` is specified):
   - `explained_variance_bar.png`
   - `cumulative_variance.png`
   - `pca_scatter.png`

## Project Structure

```
pca_dashboard/
├── src/
│   ├── __init__.py
│   ├── data_loader.py      # CSV loading and preprocessing
│   ├── pca_analyzer.py     # PCA computation and analysis
│   └── visualizer.py       # Plotting functions
├── data/                   # Place your CSV files here
├── outputs/                # Saved visualizations
├── dashboard.py            # Main entry point
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Example Workflow

1. **Prepare your data**: Ensure your CSV has numeric features
2. **Run analysis**: `python dashboard.py data/my_data.csv`
3. **Review summary**: Check the console output for variance metrics
4. **Examine plots**: Look for patterns in the scatter plot and variance distribution
5. **Decide on components**: Use the cumulative variance chart to choose how many components to retain
6. **Save results**: Use `--save` to export figures for reports

## Interpreting Results

### Explained Variance Bar Chart
- **High first component**: Your data has a dominant pattern/direction
- **Gradual decline**: Data is distributed across multiple dimensions
- **Sharp drop**: Most information is in the first few components

### Cumulative Variance Line Chart
- **80% threshold**: Common cutoff for dimensionality reduction
- **95% threshold**: Captures almost all variance in the data
- **Steep initial slope**: Good compression possible (few components needed)

### 2D Scatter Plot
- **Clusters**: Groups of similar data points
- **Separations**: Clear boundaries between categories (if labeled)
- **Outliers**: Points far from the main distribution
- **Patterns**: Linear or non-linear relationships visible in 2D

## Technical Details

- **Standardization**: All features are z-score normalized before PCA
- **Component Selection**: You can specify how many components to compute
- **Automatic Label Detection**: Categorical columns with ≤20 unique values are used for coloring
- **Modular Design**: Each component (loading, analysis, visualization) is separate and reusable

## Limitations

- Only numeric features are used (non-numeric columns are ignored)
- Requires at least 2 features for meaningful analysis
- Label column detection is heuristic-based (may not always identify the correct column)

## Troubleshooting

**"No numeric columns found"**
- Ensure your CSV contains at least one numeric column

**"Need at least 2 principal components for scatter plot"**
- Your data has fewer than 2 dimensions after processing

**Plots not displaying**
- Ensure you have a display available (or use `--no-display` with `--save`)

## License

This project is provided as-is for educational and research purposes.

