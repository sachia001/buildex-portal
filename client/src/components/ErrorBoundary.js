import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Root-level Error Boundary (PERF-012 / ARC-007).
 * Catches render-time crashes anywhere below it and shows a friendly
 * Georgian fallback UI instead of a blank white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center" style={{ padding: '80px 20px', maxWidth: 540, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
          <h3 className="fw-bold">დაფიქსირდა მოულოდნელი შეცდომა</h3>
          <p className="text-secondary">
            ბოდიში — გვერდის ჩატვირთვისას რაღაც ვერ შესრულდა. სცადეთ გვერდის
            განახლება. თუ პრობლემა გრძელდება, დაუკავშირდით ადმინისტრატორს.
          </p>
          {this.state.error?.message && (
            <pre className="text-start small bg-light p-2 rounded mt-3" style={{ whiteSpace: 'pre-wrap' }}>
              {String(this.state.error.message)}
            </pre>
          )}
          <Button variant="primary" className="mt-2" onClick={this.handleReload}>
            🔄 გვერდის განახლება
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
