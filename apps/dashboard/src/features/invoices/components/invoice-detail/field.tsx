interface FieldProps {
  label: string
  value: React.ReactNode
  mono?: boolean
}

export function Field({ label, value, mono }: FieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className={`text-sm text-foreground ${mono ? 'font-mono tabular-nums' : ''}`}
      >
        {value || '—'}
      </span>
    </div>
  )
}
