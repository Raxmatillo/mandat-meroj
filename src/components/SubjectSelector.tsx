import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useLanguage } from '../i18n'

export function SubjectSelector({
  label,
  subjects,
  value,
  onChange,
  exclude,
  placeholder = 'Fanni tanlang',
}: {
  label: string
  subjects: string[]
  value: string
  onChange: (value: string) => void
  exclude?: string
  placeholder?: string
}) {
  const { t } = useLanguage()
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => setQuery(value), [value])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery(value)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [value])

  // The other field's chosen subject is removed from the list entirely,
  // so the same subject can never be picked twice — not just validated
  // after the fact.
  //
  // No slice/cap here: the panel below is already scrollable
  // (max-h-56 overflow-auto), so every matching subject stays reachable
  // while browsing, not just once a query narrows the count down.
  const options = useMemo(() => {
    const q = query.trim().toLowerCase()
    return subjects.filter((s) => s !== exclude).filter((s) => (q ? s.toLowerCase().includes(q) : true))
  }, [subjects, query, exclude])

  useEffect(() => setHighlight(0), [options])

  function select(subject: string) {
    onChange(subject)
    setQuery(subject)
    setOpen(false)
  }

  function clear() {
    onChange('')
    setQuery('')
    setOpen(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true)
      return
    }
    if (!open || options.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(options[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery(value)
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {t(label)}
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
        <input
          type="text"
          value={query}
          placeholder={t(placeholder)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            if (e.target.value === '') onChange('')
          }}
          className="w-full rounded-xl border border-surface-line bg-white py-2.5 pl-9 pr-8 text-sm text-ink shadow-sm transition focus:border-accent-2 focus:outline-none"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label={t('Tozalash')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-faint hover:bg-surface hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && options.length > 0 && (
        <ul className="absolute z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-surface-line bg-white p-1.5 shadow-lg">
          {options.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => select(s)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  i === highlight ? 'bg-surface text-ink' : 'text-ink hover:bg-surface'
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && options.length === 0 && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-surface-line bg-white p-3 text-sm text-ink-faint shadow-lg">
          {exclude && subjects.length === 1
            ? t('Boshqa fan qolmadi — bu fan ikkinchi maydonda tanlangan')
            : t('Fan topilmadi')}
        </div>
      )}
    </div>
  )
}
