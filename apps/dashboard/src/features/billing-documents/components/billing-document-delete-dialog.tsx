import { useTranslation } from 'react-i18next'
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
import { useBillingDocumentsContext } from '../context/billing-documents.context'
import { useDeleteBillingDocument } from '../api/billing-documents.api'

export function BillingDocumentDeleteDialog() {
  const { t: tc } = useTranslation('common')
  const { t } = useTranslation('billing-documents')
  const {
    workspaceId,
    deletion: { deleteBillingDocument, setDeleteBillingDocument },
    detail: { selectedBillingDocument, closeDetail },
  } = useBillingDocumentsContext()

  const deleteMutation = useDeleteBillingDocument(workspaceId)
  const open = deleteBillingDocument !== null

  async function handleConfirm() {
    if (!deleteBillingDocument) return
    await deleteMutation.mutateAsync(deleteBillingDocument.id)
    if (selectedBillingDocument?.id === deleteBillingDocument.id) closeDetail()
    setDeleteBillingDocument(null)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) setDeleteBillingDocument(null) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('deleteDialog.descBefore')}{' '}
            <span className="font-mono font-medium text-foreground">
              {deleteBillingDocument?.invoice_number || t('detail.unparsed')}
            </span>{' '}
            {t('deleteDialog.descAfter')}
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
            onClick={() => setDeleteBillingDocument(null)}
            disabled={deleteMutation.isPending}
          >
            {tc('cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? tc('deleting') : t('deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
