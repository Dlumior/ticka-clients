import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { supplierFormSchema } from '../api/suppliers.schema'
import { useUpdateSupplier } from '../api/suppliers.api'
import type { SupplierDetail } from '../api/suppliers.api'

interface SupplierEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  supplier: SupplierDetail
}

export function SupplierEditDialog({
  open,
  onOpenChange,
  workspaceId,
  supplier,
}: SupplierEditDialogProps) {
  const { t } = useTranslation('common')
  const { t: tS } = useTranslation('suppliers')
  const updateSupplier = useUpdateSupplier(workspaceId, supplier.id)

  const form = useForm({
    defaultValues: {
      name: supplier.name ?? '',
      address: supplier.address ?? '',
      email: supplier.email ?? '',
      phone: supplier.phone ?? '',
    },
    validators: { onSubmit: supplierFormSchema },
    onSubmit: async ({ value }) => {
      await updateSupplier.mutateAsync(value)
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tS('editDialog.title')}</DialogTitle>
          <DialogDescription>
            {tS('editDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="ruc">{tS('editDialog.fieldRuc')}</FieldLabel>
              <Input id="ruc" value={supplier.ruc} disabled />
            </Field>

            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t('name')}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={tS('editDialog.namePlaceholder')}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t('email')}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={tS('editDialog.emailPlaceholder')}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{tS('editDialog.fieldPhone')}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={tS('editDialog.phonePlaceholder')}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="address">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{tS('editDialog.fieldAddress')}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={tS('editDialog.addressPlaceholder')}
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          {updateSupplier.error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-xs text-destructive" role="alert">
                {updateSupplier.error.message}
              </p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting || updateSupplier.isPending}
                >
                  {isSubmitting || updateSupplier.isPending
                    ? t('saving')
                    : t('saveChanges')}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
