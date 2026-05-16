import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { RiBriefcaseLine } from "@remixicon/react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zOrganizationWorkspaceCreateInputRequest } from "@/features/workspaces/api/workspaces.schema"
import { useCreateWorkspace } from "@/features/workspaces/api/workspaces.api"

interface CreateWorkspaceDialogProps {
  organizationId: string
  orgSlug: string
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateWorkspaceDialog({
  organizationId,
  orgSlug,
  trigger,
  open: externalOpen,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const router = useRouter()
  const createWorkspace = useCreateWorkspace(organizationId)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen

  function handleOpenChange(next: boolean) {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function close() {
    handleOpenChange(false)
  }

  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: zOrganizationWorkspaceCreateInputRequest },
    onSubmit: async ({ value }) => {
      const workspace = await createWorkspace.mutateAsync(value)
      form.reset()
      close()
      router.navigate({
        to: "/orgs/$orgSlug/workspaces/$workspaceSlug",
        params: { orgSlug, workspaceSlug: workspace.slug },
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}

      <DialogContent className="sm:max-w-md">
        <div
          className="absolute top-0 right-0 left-0 h-0.5 rounded-t-xl"
          style={{
            background:
              "linear-gradient(90deg,var(--color-primary),var(--color-accent))",
          }}
        />

        <DialogHeader className="pt-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 ring-inset">
            <RiBriefcaseLine className="size-4" />
          </div>
          <DialogTitle>New workspace</DialogTitle>
          <DialogDescription>
            Workspaces help you organise projects, tasks, and team activity in one focused place.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Design System, Backend API…"
                      autoComplete="off"
                      autoFocus
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting || createWorkspace.isPending}
                >
                  {isSubmitting || createWorkspace.isPending
                    ? "Creating…"
                    : "Create workspace"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>

        {createWorkspace.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
            <p className="text-xs text-destructive" role="alert">
              {createWorkspace.error.message}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
