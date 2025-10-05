// frontend/src/components/ErrorBoundary.js
// REACT CONCEPTS USED:
// - Class Component with Error Boundary lifecycle methods
// - Component Lifecycle (componentDidCatch, getDerivedStateFromError)
// - Error Handling (catch JavaScript errors anywhere in component tree)
// - Conditional Rendering (error state vs normal rendering)

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  // REACT CONCEPT: Error Boundary Lifecycle Method
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  // REACT CONCEPT: Error Boundary Lifecycle Method
  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  // REACT CONCEPT: Event Handling - Reset error state
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    // REACT CONCEPT: Conditional Rendering - Error state vs normal rendering
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-content">
            <AlertTriangle size={48} className="error-icon" />
            <h2>Something went wrong</h2>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <button 
              onClick={this.handleReset}
              className="btn error-reset-btn"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // REACT CONCEPT: Component Composition - Render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
