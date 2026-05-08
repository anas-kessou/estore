import React from 'react';

const searilizeError = (error: any) => {
  if (error instanceof Error) {
    return error.message + '\n' + error.stack;
  }
  return JSON.stringify(error, null, 2);
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // #region agent log
    fetch('http://127.0.0.1:7763/ingest/dde67de3-8924-4544-a310-977ecb73aa4d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '29f1c7' },
      body: JSON.stringify({
        sessionId: '29f1c7',
        runId: 'blank-ui-1',
        hypothesisId: 'H2',
        location: 'src/components/ErrorBoundary.tsx:componentDidCatch',
        message: 'caught react error',
        data: { error: searilizeError(error), componentStack: String(info?.componentStack ?? '') },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded">
          <h2 className="text-red-500">Something went wrong.</h2>
          <pre className="mt-2 text-sm">{searilizeError(this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
