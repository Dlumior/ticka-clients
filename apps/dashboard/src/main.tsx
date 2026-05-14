import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { AppProviders, queryClient } from '@/app/providers'
import { createAppRouter } from '@/app/router'
import { useAuth } from '@/features/auth/auth.context'
import './index.css'

const router = createAppRouter(queryClient)

function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
