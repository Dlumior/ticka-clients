export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
      {children}
    </p>
  )
}
