import { RiErrorWarningLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useInvoicesContext } from '../context/invoices.context'
import { useDeleteInvoice } from '../api/invoices.api'

export function InvoiceDeleteDialog() {
  const {
    workspaceId,
    deletion: { deleteInvoice, setDeleteInvoice },
    detail: { selectedInvoice, closeDetail },
  } = useInvoicesContext()

  const deleteMutation = useDeleteInvoice(workspaceId)
  const open = deleteInvoice !== null

  async function handleConfirm() {
    if (!deleteInvoice) return
    await deleteMutation.mutateAsync(deleteInvoice.id)
    if (selectedInvoice?.id === deleteInvoice.id) closeDetail()
    setDeleteInvoice(null)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) setDeleteInvoice(null) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete invoice</DialogTitle>
          <DialogDescription>
            This permanently deletes invoice{' '}
            <span className="font-mono font-medium text-foreground">
              {deleteInvoice?.invoice_number || '(unparsed)'}
            </span>{' '}
            and its parsed data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {deleteMutation.error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
            <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-xs text-destructive" role="alert">
              {deleteMutation.error.message}
            </p>
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteInvoice(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
