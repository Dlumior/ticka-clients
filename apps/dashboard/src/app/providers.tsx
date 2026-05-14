import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/features/auth/auth.context'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30 * 1000 },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-left" />}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
