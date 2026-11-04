import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-surface-line bg-surface px-6 py-12 text-center">
      <SearchX className="h-6 w-6 text-ink-faint" aria-hidden="true" />
      <p className="font-display text-base font-bold text-ink">{title}</p>
      {description && <p className="text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  )
}
