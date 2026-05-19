import type { ReactNode } from 'react'

interface IfCanProps {
  condition: boolean
  children: ReactNode
  fallback?: ReactNode
}

export function IfCan({ condition, children, fallback = null }: IfCanProps) {
  return condition ? <>{children}</> : <>{fallback}</>
}
