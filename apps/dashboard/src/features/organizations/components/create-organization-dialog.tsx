import { useRef, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { RiAddLine } from "@remixicon/react"

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
import { zOrganizationCreateInputRequest } from "@/features/organizations/api/organizations.schema"
import { useCreateOrganization } from "@/features/organizations/api/organizations.api"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

interface CreateOrganizationDialogProps {
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateOrganizationDialog({
  trigger,
  open: externalOpen,
  onOpenChange,
}: CreateOrganizationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const fieldRef = useRef<HTMLInputElement>(null)
  const createOrg = useCreateOrganization()

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
    defaultValues: { name: "", slug: "" },
    validators: { onSubmit: zOrganizationCreateInputRequest },
    onSubmit: async ({ value }) => {
      await createOrg.mutateAsync(value)
      form.reset()
      close()
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
          <DialogTitle>New organization</DialogTitle>
          <DialogDescription>
            Create a new workspace to organise your projects and invoices.
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
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        const rawSlug = form.getFieldValue("slug")
                        if (
                          !rawSlug ||
                          rawSlug === slugify(field.state.value)
                        ) {
                          form.setFieldValue("slug", slugify(e.target.value))
                        }
                      }}
                      aria-invalid={isInvalid}
                      placeholder="Acme Corp"
                      autoComplete="off"
                      ref={fieldRef}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="slug"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground/50 select-none">
                        /
                      </span>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(slugify(e.target.value))
                        }
                        aria-invalid={isInvalid}
                        placeholder="acme-corp"
                        autoComplete="off"
                        className="pl-5"
                      />
                    </div>
                    <p
                      className="text-sm leading-normal font-normal text-muted-foreground"
                      data-slot="field-description"
                    >
                      URL-friendly identifier. Letters, numbers, hyphens and
                      underscores only.
                    </p>
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
                  disabled={isSubmitting || createOrg.isPending}
                >
                  {isSubmitting || createOrg.isPending ? "Creating…" : "Create"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>

        {createOrg.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
            <p className="text-xs text-destructive" role="alert">
              {createOrg.error.message}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
