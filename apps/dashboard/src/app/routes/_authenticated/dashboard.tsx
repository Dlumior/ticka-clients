import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome back.</p>
    </div>
  )
}
