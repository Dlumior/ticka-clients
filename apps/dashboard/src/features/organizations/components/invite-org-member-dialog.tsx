import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { RiUserAddLine } from '@remixicon/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ORG_ROLES, ORG_ROLE_LABEL } from '@/features/permissions'
import type { OrgRole } from '@/features/permissions'
import { useInviteOrgMember } from '../api/org-members.api'

const zInviteOrgMemberForm = z.object({
  email: z.string().email('Enter a valid email address').min(1),
  role: z.enum(['owner', 'admin', 'member', 'viewer'] as [OrgRole, ...OrgRole[]]),
})

interface InviteOrgMemberDialogProps {
  orgId: string
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function InviteOrgMemberDialog({
  orgId,
  trigger,
  open: externalOpen,
  onOpenChange,
}: InviteOrgMemberDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const invite = useInviteOrgMember(orgId)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen

  function handleOpenChange(next: boolean) {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const form = useForm({
    defaultValues: { email: '', role: 'member' as OrgRole },
    validatorAdapter: zodValidator(),
    validators: { onSubmit: zInviteOrgMemberForm },
    onSubmit: async ({ value }) => {
      await invite.mutateAsync(value)
      form.reset()
      handleOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}

      <DialogContent className="sm:max-w-md">
        <div
          className="absolute top-0 right-0 left-0 h-0.5 rounded-t-xl"
          style={{
            background: 'linear-gradient(90deg,var(--color-primary),var(--color-accent))',
          }}
        />

        <DialogHeader className="pt-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <RiUserAddLine className="size-4" />
          </div>
          <DialogTitle>Invite to organization</DialogTitle>
          <DialogDescription>
            Send an invitation to add someone to this organization.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="colleague@company.com"
                      autoComplete="off"
                      autoFocus
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as OrgRole)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORG_ROLES.filter((r) => r !== 'owner').map((role) => (
                        <SelectItem key={role} value={role}>
                          {ORG_ROLE_LABEL[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting || invite.isPending}>
                  {isSubmitting || invite.isPending ? 'Sending…' : 'Send invitation'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>

        {invite.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
            <p className="text-xs text-destructive" role="alert">
              {invite.error.message}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
