import { z } from 'zod'

// Editable supplier contact fields. ``ruc`` is intentionally omitted — it is the
// workspace dedup key and is sourced from invoice parsing on the backend.
export const supplierFormSchema = z.object({
  name: z.string().max(255),
  address: z.string(),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]),
  phone: z.string().max(30),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>
