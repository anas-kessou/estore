import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();

// #region agent log
const __dbgPost = (payload: Record<string, unknown>) =>
  fetch('http://127.0.0.1:7763/ingest/dde67de3-8924-4544-a310-977ecb73aa4d', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '29f1c7' },
    body: JSON.stringify({
      sessionId: '29f1c7',
      runId: 'blank-ui-1',
      timestamp: Date.now(),
      ...payload,
    }),
  }).catch(() => {});

window.addEventListener('error', (e) => {
  __dbgPost({
    hypothesisId: 'H1',
    location: 'src/main.tsx:runtime',
    message: 'window.error',
    data: { message: String(e.message), filename: String(e.filename), lineno: e.lineno, colno: e.colno },
  });
});

window.addEventListener('unhandledrejection', (e) => {
  __dbgPost({
    hypothesisId: 'H1',
    location: 'src/main.tsx:runtime',
    message: 'window.unhandledrejection',
    data: { reason: String((e as PromiseRejectionEvent).reason) },
  });
});

const rootEl = document.getElementById('root');
__dbgPost({
  hypothesisId: 'H1',
  location: 'src/main.tsx:bootstrap',
  message: 'bootstrap',
  data: { hasRoot: !!rootEl, userAgent: navigator.userAgent },
});
// #endregion agent log

createRoot(rootEl!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)

// #region agent log
__dbgPost({
  hypothesisId: 'H3',
  location: 'src/main.tsx:after-render-call',
  message: 'render invoked',
  data: {},
});
// #endregion agent log
