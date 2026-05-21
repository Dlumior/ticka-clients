import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import * as Sentry from '@sentry/react'
import { AppProviders, queryClient } from '@/app/providers'
import { createAppRouter } from '@/app/router'
import { useAuth } from '@/features/auth/auth.context'
import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

const router = createAppRouter(queryClient)

function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong. Please refresh the page.</p>}>
      <AppProviders>
        <App />
      </AppProviders>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
