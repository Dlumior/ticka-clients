import { createFileRoute } from '@tanstack/react-router'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganization } from '@/hooks/useOrganization'

const mockInvoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: 2500.0, status: 'Paid', date: '2024-02-01' },
  { id: 'INV-002', client: 'TechStart Inc', amount: 1800.0, status: 'Pending', date: '2024-02-05' },
  { id: 'INV-003', client: 'Design Studio', amount: 3200.0, status: 'Overdue', date: '2024-01-15' },
  { id: 'INV-004', client: 'Global Systems', amount: 4500.0, status: 'Paid', date: '2024-02-10' },
]

export const Route = createFileRoute('/dashboard/$organizationId/workspaces/$workspaceId/invoices')({
  component: WorkspaceInvoicesPage,
  beforeLoad: () => ({
    breadcrumb: 'Invoices',
  }),
})

function WorkspaceInvoicesPage() {
  const { currentOrganization, currentWorkspace, isLoading } = useOrganization()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!currentOrganization || !currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif">Workspace Not Found</CardTitle>
            <CardDescription>
              The workspace you are looking for does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = mockInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = mockInvoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track invoices for {currentWorkspace.name}
          </p>
        </div>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            {mockInvoices.length} invoices in {currentWorkspace.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invoice.id}</span>
                    <Badge
                      variant={
                        invoice.status === 'Paid'
                          ? 'default'
                          : invoice.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.client}</p>
                  <p className="text-xs text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">${invoice.amount.toLocaleString()}</span>
                  <Button variant="ghost" size="icon">
                    <IconDownload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
