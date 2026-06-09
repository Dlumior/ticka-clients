import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { RiFileCopyLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { OrgPermissions } from '@/features/permissions'
import type { OrganizationDetail } from '../api/organizations.api'
import { useUpdateOrganization } from '../api/organizations.api'

const zOrgInfoForm = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[-a-zA-Z0-9_]+$/, 'Only letters, numbers, hyphens and underscores'),
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
}

interface OrgSettingsInfoProps {
  organization: OrganizationDetail
  perms: OrgPermissions
}

export function OrgSettingsInfo({ organization, perms }: OrgSettingsInfoProps) {
  const { t } = useTranslation('common')
  const updateOrg = useUpdateOrganization(organization.id)
  const [copied, setCopied] = useState(false)

  const form = useForm({
    defaultValues: { name: organization.name, slug: organization.slug },
    validatorAdapter: zodValidator(),
    validators: { onSubmit: zOrgInfoForm },
    onSubmit: async ({ value }) => {
      await updateOrg.mutateAsync(value)
    },
  })

  function copyEmail() {
    navigator.clipboard.writeText(organization.inbox_email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const canEdit = perms.canWriteOrganization

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold">Organization info</h2>
        <p className="text-sm text-muted-foreground">
          {canEdit
            ? "Update your organization's name and URL slug."
            : "Your organization's details."}
        </p>
      </div>

      {canEdit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t('name')}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="My Organization"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="slug">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <span className="border-r border-input px-3 py-2 text-sm text-muted-foreground select-none">
                        /orgs/
                      </span>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => {
                          field.handleChange(slugify(field.state.value))
                          field.handleBlur()
                        }}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="my-org"
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <div className="mt-6 flex items-center gap-2">
            <form.Subscribe
              selector={(s) => ({
                isSubmitting: s.isSubmitting,
                values: s.values,
              })}
            >
              {({ isSubmitting, values }) => {
                const isDirty =
                  values.name !== organization.name || values.slug !== organization.slug
                return (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateOrg.isPending || !isDirty}
                    >
                      {isSubmitting || updateOrg.isPending ? t('saving') : t('saveChanges')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      disabled={isSubmitting || !isDirty}
                    >
                      {t('cancel')}
                    </Button>
                  </>
                )
              }}
            </form.Subscribe>
          </div>

          {updateOrg.error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-xs text-destructive" role="alert">
                {updateOrg.error.message}
              </p>
            </div>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
          <InfoRow label="Name" value={organization.name} />
          <InfoRow label="Slug" value={organization.slug} mono />
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Inbox email</span>
            <div className="flex items-center gap-1.5">
              <code className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
                {organization.inbox_email}
              </code>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={copyEmail}
                      aria-label="Copy inbox email"
                    >
                      <RiFileCopyLine className="size-3.5" />
                    </Button>
                  }
                />
                <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Type</span>
            <code className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono capitalize">
              {organization.type}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Members</span>
            <span className="text-xs text-foreground">{organization.member_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Workspaces</span>
            <span className="text-xs text-foreground">{organization.workspace_count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      {mono ? (
        <code className="text-xs text-foreground font-mono">{value}</code>
      ) : (
        <span className="text-xs text-foreground">{value}</span>
      )}
    </div>
  )
}
