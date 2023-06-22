import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error or perform any additional actions
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      const specificErrorMessage = "Operation 'rooms.insertOne()' buffering timed out after 10000ms";
      if (this.props.error?.message === specificErrorMessage) {
        return (
          <div>
            <h1>Server is down. Please try again later.</h1>
          </div>
        );
      }
      // Render a generic error message for other errors
      return (
        <div>
          <h1>Something went wrong. Please try again.</h1>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
