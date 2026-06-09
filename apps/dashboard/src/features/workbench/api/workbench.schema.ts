import { z } from 'zod'

// Template builder form. ``columns`` is the ordered list the user assembles in
// the field picker; each column maps a registry field key to a custom header.
export const templateColumnSchema = z.object({
  field: z.string().min(1),
  label: z.string().min(1, 'Column name is required'),
})

export const templateFormSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(120),
  columns: z.array(templateColumnSchema).min(1, 'Add at least one column'),
})

export type TemplateFormValues = z.infer<typeof templateFormSchema>

export const periodFormSchema = z
  .object({
    name: z.string().min(1, 'Period name is required').max(120),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
  })
  .refine((v) => v.start_date <= v.end_date, {
    message: 'End date must be on or after the start date',
    path: ['end_date'],
  })

export type PeriodFormValues = z.infer<typeof periodFormSchema>
