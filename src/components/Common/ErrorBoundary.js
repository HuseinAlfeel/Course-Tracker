import React from 'react';

// 🛡️ ERROR BOUNDARY: Catches JavaScript errors anywhere in the component tree
// This prevents the entire app from crashing when there's an error in a component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // This lifecycle method catches errors during rendering
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  // This lifecycle method catches errors and logs them
  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorContent}>
            <h2 style={styles.errorTitle}>🚨 Oops! Something went wrong</h2>
            <p style={styles.errorMessage}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            
            <button 
              style={styles.refreshButton}
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Page
            </button>
            
            {/* Show error details in development mode */}
            {process.env.NODE_ENV === 'development' && (
              <details style={styles.errorDetails}>
                <summary style={styles.errorSummary}>Error Details (Development)</summary>
                <pre style={styles.errorStack}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

// Styles for the error boundary
const styles = {
  errorContainer: {
    minHeight: '100vh',
    backgroundColor: '#1e1e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  errorContent: {
    backgroundColor: '#2c2c2c',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '600px',
    textAlign: 'center',
    border: '1px solid #ff6b6b'
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: '1.5rem',
    marginBottom: '16px'
  },
  errorMessage: {
    color: '#e0e0e0',
    fontSize: '1rem',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  refreshButton: {
    backgroundColor: '#4d9aff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  errorDetails: {
    marginTop: '24px',
    textAlign: 'left'
  },
  errorSummary: {
    color: '#ff9500',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  errorStack: {
    backgroundColor: '#1a1a1a',
    color: '#e0e0e0',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    overflow: 'auto',
    marginTop: '8px'
  }
};

export default ErrorBoundary;
