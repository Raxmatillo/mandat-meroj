import { useEffect, useRef, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Check, ChevronDown } from 'lucide-react'
import type { SortDirection } from '../types'
import { useLanguage } from '../i18n'

export interface SortFieldOption<F extends string> {
  value: F
  label: string
}

/**
 * Compact sort control: a custom dropdown (not a native <select>, whose open
 * option list can't be restyled) plus a direction toggle icon. Built to
 * match the app's own panel styling (white surface, rounded corners, soft
 * shadow) instead of the browser's default listbox look.
 */
export function SortSelect<F extends string>({
  field,
  direction,
  fieldOptions,
  onFieldChange,
  onDirectionToggle,
  hideDirectionWhen,
}: {
  field: F
  direction: SortDirection
  fieldOptions: SortFieldOption<F>[]
  onFieldChange: (field: F) => void
  onDirectionToggle: () => void
  /** Optional field value for which the direction toggle should be hidden (e.g. a "Standart" option). */
  hideDirectionWhen?: F
}) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const activeLabel = t(fieldOptions.find((opt) => opt.value === field)?.label ?? '')
  const showDirection = field !== hideDirectionWhen

  return (
    <div ref={rootRef} className="inline-flex items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-line bg-white py-1.5 pl-2.5 pr-2 text-xs font-medium text-ink-soft shadow-sm transition hover:border-accent-2/50 focus:border-accent-2 focus:outline-none"
        >
          {activeLabel}
          <ChevronDown
            className={`h-3.5 w-3.5 text-ink-faint transition ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute right-0 top-full z-20 mt-1.5 min-w-[9.5rem] overflow-hidden rounded-xl border border-surface-line bg-white py-1 shadow-lg shadow-ink/10"
          >
            {fieldOptions.map((opt) => {
              const isActive = opt.value === field
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onFieldChange(opt.value)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-medium transition ${
                      isActive ? 'bg-surface text-ink' : 'text-ink-soft hover:bg-surface'
                    }`}
                  >
                    {t(opt.label)}
                    {isActive && <Check className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {showDirection && (
        <button
          type="button"
          onClick={onDirectionToggle}
          aria-label={t(direction === 'desc' ? 'Kamayish tartibiga o‘tish' : 'O‘sish tartibiga o‘tish')}
          title={t(direction === 'desc' ? 'Yuqoridan pastga' : 'Pastdan yuqoriga')}
          className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-surface-line bg-white text-ink-soft shadow-sm transition hover:border-accent-2/50 hover:text-accent-2"
        >
          {direction === 'desc' ? (
            <ArrowDownWideNarrow className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowUpWideNarrow className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  )
}
