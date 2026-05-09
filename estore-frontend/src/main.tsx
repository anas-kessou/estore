import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { Toaster } from 'sonner'
import App from './App.tsx'

const queryClient = new QueryClient();


const rootEl = document.getElementById('root');

createRoot(rootEl!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" richColors closeButton />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)


