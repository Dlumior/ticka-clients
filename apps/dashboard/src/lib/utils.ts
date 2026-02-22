import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a TanStack Router route string by replacing $param tokens with actual values.
 * e.g. resolveRoute('/dashboard/$organizationId/users', { organizationId: 'abc' })
 *      => '/dashboard/abc/users'
 */
export function resolveRoute(
  to: string,
  params: Record<string, string>,
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`$${key}`, value),
    to,
  )
}
