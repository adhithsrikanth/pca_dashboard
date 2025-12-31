import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from io import StringIO
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'src'))

from data_loader import prepare_data_from_dataframe
from pca_analyzer import standardize_data, compute_pca, get_variance_metrics


st.set_page_config(
    page_title="PCA Dashboard",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
    <style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        margin-bottom: 1rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
    }
    </style>
""", unsafe_allow_html=True)


def create_interactive_variance_bar(explained_variance_ratio, n_components_to_show):
    components_to_show = min(n_components_to_show, len(explained_variance_ratio))
    variance_to_show = explained_variance_ratio[:components_to_show]
    component_numbers = list(range(1, components_to_show + 1))
    
    fig = go.Figure(data=[
        go.Bar(
            x=component_numbers,
            y=variance_to_show * 100,
            text=[f'{v*100:.2f}%' for v in variance_to_show],
            textposition='outside',
            marker=dict(color='steelblue', line=dict(color='black', width=1)),
            hovertemplate='PC%{x}: %{y:.2f}% variance<extra></extra>'
        )
    ])
    
    fig.update_layout(
        title='Explained Variance by Principal Component',
        xaxis_title='Principal Component',
        yaxis_title='Explained Variance (%)',
        height=500,
        showlegend=False,
        template='plotly_white'
    )
    
    return fig


def create_interactive_cumulative_variance(cumulative_variance, n_components_to_show):
    components_to_show = min(n_components_to_show, len(cumulative_variance))
    variance_to_show = cumulative_variance[:components_to_show]
    component_numbers = list(range(1, components_to_show + 1))
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=component_numbers,
        y=variance_to_show * 100,
        mode='lines+markers',
        name='Cumulative Variance',
        line=dict(color='darkgreen', width=3),
        marker=dict(size=8),
        hovertemplate='Components: %{x}<br>Cumulative Variance: %{y:.2f}%<extra></extra>'
    ))
    
    fig.add_hline(y=80, line_dash="dash", line_color="orange", 
                  annotation_text="80% threshold", annotation_position="right")
    fig.add_hline(y=95, line_dash="dash", line_color="red",
                  annotation_text="95% threshold", annotation_position="right")
    
    fig.update_layout(
        title='Cumulative Explained Variance',
        xaxis_title='Number of Principal Components',
        yaxis_title='Cumulative Explained Variance (%)',
        height=500,
        yaxis=dict(range=[0, 105]),
        template='plotly_white',
        hovermode='x unified'
    )
    
    return fig


def create_interactive_scatter(transformed_data, labels, label_column_name):
    pc1 = transformed_data[:, 0]
    pc2 = transformed_data[:, 1]
    
    if labels is not None:
        df_plot = pd.DataFrame({
            'PC1': pc1,
            'PC2': pc2,
            'Label': labels
        })
        fig = px.scatter(
            df_plot, x='PC1', y='PC2', color='Label',
            title='2D Projection: First Two Principal Components',
            labels={'PC1': 'First Principal Component (PC1)',
                   'PC2': 'Second Principal Component (PC2)',
                   'Label': label_column_name if label_column_name else 'Category'},
            hover_data={'PC1': ':.3f', 'PC2': ':.3f'},
            width=800, height=600
        )
    else:
        df_plot = pd.DataFrame({'PC1': pc1, 'PC2': pc2})
        fig = px.scatter(
            df_plot, x='PC1', y='PC2',
            title='2D Projection: First Two Principal Components',
            labels={'PC1': 'First Principal Component (PC1)',
                   'PC2': 'Second Principal Component (PC2)'},
            width=800, height=600,
            color_discrete_sequence=['steelblue']
        )
    
    fig.update_traces(marker=dict(size=8, line=dict(width=1, color='black')))
    fig.update_layout(template='plotly_white')
    
    return fig


def main():
    st.markdown('<div class="main-header">PCA Dashboard</div>', unsafe_allow_html=True)
    st.markdown("Upload a CSV file to perform Principal Component Analysis (PCA) on your data.")
    
    with st.sidebar:
        st.header("Data Input")
        
        uploaded_file = st.file_uploader(
            "Choose a CSV file",
            type=['csv'],
            help="Upload a CSV file with numeric features. Optionally include categorical columns for labeling."
        )
        
        st.caption("Tip: Use `data/sample_data.csv` to try with sample data")
        
        st.markdown("---")
        
        if uploaded_file is not None:
            st.header("Analysis Settings")
            
            max_components = st.number_input(
                "Number of Components",
                min_value=1,
                value=None,
                help="Number of principal components to compute (leave empty for all components)"
            )
            if max_components == 0:
                max_components = None
            
            components_to_show = st.number_input(
                "Components to Display in Plots",
                min_value=1,
                value=None,
                help="Number of components to show in variance plots (leave empty for all)"
            )
            if components_to_show == 0:
                components_to_show = None
            
            st.markdown("---")
    
    if uploaded_file is not None:
        try:
            df = pd.read_csv(uploaded_file)
            
            with st.expander("Data Preview", expanded=True):
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Rows", len(df))
                with col2:
                    st.metric("Columns", len(df.columns))
                with col3:
                    numeric_cols = df.select_dtypes(include=[np.number]).columns
                    st.metric("Numeric Features", len(numeric_cols))
                
                st.dataframe(df.head(10), use_container_width=True)
            
            try:
                numeric_df, label_col, original_df = prepare_data_from_dataframe(df)
                
                if label_col:
                    st.info(f"Label column detected: **{label_col}** (will be used for coloring points)")
                
                with st.spinner("Performing PCA analysis..."):
                    standardized_data = standardize_data(numeric_df)
                    
                    n_components = max_components if max_components else None
                    pca, transformed_data = compute_pca(standardized_data, n_components)
                    
                    explained_variance_ratio, cumulative_variance = get_variance_metrics(pca)
                
                st.markdown("---")
                st.header("Analysis Results")
                
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Original Features", len(numeric_df.columns))
                with col2:
                    st.metric("Principal Components", pca.n_components_)
                with col3:
                    idx_80 = next((i for i, v in enumerate(cumulative_variance) if v >= 0.80), None)
                    comps_80 = (idx_80 + 1) if idx_80 is not None else "N/A"
                    st.metric("Components for 80% Variance", comps_80)
                with col4:
                    idx_95 = next((i for i, v in enumerate(cumulative_variance) if v >= 0.95), None)
                    comps_95 = (idx_95 + 1) if idx_95 is not None else "N/A"
                    st.metric("Components for 95% Variance", comps_95)
                
                with st.expander("Detailed Variance Breakdown"):
                    variance_df = pd.DataFrame({
                        'Component': [f'PC{i+1}' for i in range(len(explained_variance_ratio))],
                        'Explained Variance (%)': [f'{v*100:.2f}%' for v in explained_variance_ratio],
                        'Cumulative Variance (%)': [f'{v*100:.2f}%' for v in cumulative_variance]
                    })
                    st.dataframe(variance_df, use_container_width=True, hide_index=True)
                
                st.markdown("---")
                st.header("Visualizations")
                
                n_show = components_to_show if components_to_show else pca.n_components_
                
                st.subheader("Explained Variance by Component")
                fig_bar = create_interactive_variance_bar(explained_variance_ratio, n_show)
                st.plotly_chart(fig_bar, use_container_width=True)
                
                st.subheader("Cumulative Explained Variance")
                fig_line = create_interactive_cumulative_variance(cumulative_variance, n_show)
                st.plotly_chart(fig_line, use_container_width=True)
                
                if transformed_data.shape[1] >= 2:
                    st.subheader("2D Projection (First Two Components)")
                    labels_array = original_df[label_col].values if label_col else None
                    fig_scatter = create_interactive_scatter(
                        transformed_data, labels_array, label_col
                    )
                    st.plotly_chart(fig_scatter, use_container_width=True)
                else:
                    st.warning("Need at least 2 principal components for scatter plot.")
                
                st.markdown("---")
                st.header("Download Results")
                
                transformed_df = pd.DataFrame(
                    transformed_data,
                    columns=[f'PC{i+1}' for i in range(transformed_data.shape[1])]
                )
                
                if label_col:
                    transformed_df[label_col] = original_df[label_col].values
                
                csv = transformed_df.to_csv(index=False)
                st.download_button(
                    label="Download Transformed Data (CSV)",
                    data=csv,
                    file_name="pca_transformed_data.csv",
                    mime="text/csv"
                )
                
            except ValueError as e:
                st.error(f"Error: {str(e)}")
                st.info("Make sure your CSV file contains at least one numeric column.")
            except Exception as e:
                st.error(f"Error during analysis: {str(e)}")
                st.exception(e)
        
        except Exception as e:
            st.error(f"Error loading file: {str(e)}")
            st.info("Please make sure you've uploaded a valid CSV file.")
    
    else:
        st.info("Please upload a CSV file using the sidebar to get started.")
        
        with st.expander("How to use this dashboard"):
            st.markdown("""
            ### Getting Started
            
            1. **Upload Data**: Click "Browse files" in the sidebar and select your CSV file
               - Your CSV should contain numeric columns (features)
               - Optional: Include a categorical column for labeling/clustering
            
            2. **Configure Settings**: 
               - Set the number of principal components to compute
               - Choose how many components to display in plots
            
            3. **Explore Results**:
               - View variance explained by each component
               - See cumulative variance thresholds (80%, 95%)
               - Explore 2D projections of your data
            
            4. **Download**: Export your transformed data with principal components
            
            ### Data Format
            
            Your CSV file should look like:
            ```
            feature1, feature2, feature3, ..., label
            2.5, 3.1, 1.2, ..., CategoryA
            3.2, 2.8, 1.5, ..., CategoryB
            ...
            ```
            
            - **Numeric columns** will be used for PCA
            - **Categorical columns** (if present) will be used for coloring points
            """)


if __name__ == '__main__':
    main()
