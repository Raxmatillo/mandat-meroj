import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { YEAR_CONFIGS } from '../data/yearConfig'
import { useLanguage } from '../i18n'

const AVAILABLE_YEARS = [{ year: 2026, label: '2026-yil' }, ...YEAR_CONFIGS]

/**
 * Custom dropdown (not a native <select>) so the open option list follows
 * the app's own design — white surface, rounded corners, soft shadow —
 * instead of the browser's plain default listbox.
 */
export function YearSelector({
  year,
  onChange,
}: {
  year: number
  onChange: (year: number) => void
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

  const activeLabel = t(AVAILABLE_YEARS.find((c) => c.year === year)?.label ?? String(year))

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('Qabul yilini tanlash')}
        className="inline-flex items-center gap-2 rounded-xl border border-surface-line bg-white py-2 pl-3.5 pr-3 text-sm font-semibold text-ink shadow-sm transition hover:border-accent-2 focus:outline-none"
      >
        {activeLabel}
        <ChevronDown
          className={`h-4 w-4 text-ink-faint transition ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-20 mt-1.5 min-w-[8.5rem] overflow-hidden rounded-xl border border-surface-line bg-white py-1 shadow-lg shadow-ink/10"
        >
          {AVAILABLE_YEARS.map((c) => {
            const isActive = c.year === year
            return (
              <li key={c.year}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(c.year)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm font-medium transition ${
                    isActive ? 'bg-surface text-ink' : 'text-ink-soft hover:bg-surface'
                  }`}
                >
                  {t(c.label)}
                  {isActive && <Check className="h-4 w-4 text-accent-2" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
