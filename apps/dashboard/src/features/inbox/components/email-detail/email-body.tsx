import { Skeleton } from '@/components/ui/skeleton'

interface EmailBodyProps {
  bodyHtml: string
  bodyText: string
  isLoading: boolean
}

export function EmailBody({ bodyHtml, bodyText, isLoading }: EmailBodyProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 rounded-lg border bg-muted/20 p-4">
        {[3 / 4, 1, 5 / 6, 2 / 3, 4 / 5, 1, 3 / 4].map((w, i) => (
          <Skeleton key={i} className="h-3 rounded" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    )
  }

  if (bodyHtml) {
    return (
      <div className="flex-1 overflow-hidden rounded-lg border bg-white shadow-sm">
        {/* sandbox="" blocks all scripts/forms/top-nav in the iframe */}
        <iframe srcDoc={bodyHtml} sandbox="" title="Email body" className="size-full" />
      </div>
    )
  }

  if (bodyText) {
    return (
      <pre className="flex-1 overflow-y-auto rounded-lg border bg-muted/20 p-4 font-sans text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
        {bodyText}
      </pre>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/10">
      <p className="text-sm text-muted-foreground">No message body.</p>
    </div>
  )
}
