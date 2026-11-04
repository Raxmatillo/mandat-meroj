import { useMemo } from 'react'
import { X } from 'lucide-react'
import type { Filters, ScoredProgram } from '../types'
import { EMPTY_FILTERS } from '../types'
import { PlainSelect } from './PlainSelect'
import { useLanguage } from '../i18n'

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'uz'))
}

export function FilterPanel({
  open,
  onClose,
  results,
  filters,
  onChange,
}: {
  open: boolean
  onClose: () => void
  results: ScoredProgram[]
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  const { t } = useLanguage()
  const options = useMemo(
    () => ({
      universities: uniqueSorted(results.map((r) => r.universityName)),
      regions: uniqueSorted(results.map((r) => r.region)),
      directions: uniqueSorted(results.map((r) => r.directionName)),
      educationTypes: uniqueSorted(results.map((r) => r.educationType)),
      languages: uniqueSorted(results.map((r) => r.language)),
    }),
    [results],
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-stretch">
      <button
        type="button"
        aria-label={t('Filterni yopish')}
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
      />
      <div className="relative flex max-h-[85vh] w-full flex-col rounded-t-3xl border-t border-surface-line bg-white p-5 shadow-2xl sm:h-full sm:max-h-none sm:w-96 sm:rounded-none sm:rounded-l-3xl sm:border-l sm:border-t-0 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">{t('Filtrlar')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Yopish')}
            className="rounded-full p-1.5 text-ink-soft hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          <PlainSelect
            label="OTM"
            value={filters.university}
            options={options.universities}
            onChange={(university) => onChange({ ...filters, university })}
          />
          <PlainSelect
            label="Viloyat"
            value={filters.region}
            options={options.regions}
            onChange={(region) => onChange({ ...filters, region })}
          />
          <PlainSelect
            label="Yo‘nalish"
            value={filters.direction}
            options={options.directions}
            onChange={(direction) => onChange({ ...filters, direction })}
          />
          <PlainSelect
            label="Ta’lim shakli"
            value={filters.educationType}
            options={options.educationTypes}
            onChange={(educationType) => onChange({ ...filters, educationType })}
          />
          <PlainSelect
            label="Ta’lim tili"
            value={filters.language}
            options={options.languages}
            onChange={(language) => onChange({ ...filters, language })}
          />
          <PlainSelect
            label="Grant / Kontrakt"
            value={filters.type === 'all' ? '' : filters.type === 'grant' ? 'Grant' : 'Kontrakt'}
            options={['Grant', 'Kontrakt']}
            onChange={(v) =>
              onChange({ ...filters, type: v === 'Grant' ? 'grant' : v === 'Kontrakt' ? 'contract' : 'all' })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t('Min. zaxira')}
              </span>
              <input
                type="number"
                value={filters.minReserve ?? ''}
                onChange={(e) =>
                  onChange({ ...filters, minReserve: e.target.value === '' ? null : Number(e.target.value) })
                }
                className="w-full rounded-xl border border-surface-line bg-white py-2.5 px-3 font-mono-num text-sm text-ink shadow-sm focus:border-accent-2 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t('Maks. zaxira')}
              </span>
              <input
                type="number"
                value={filters.maxReserve ?? ''}
                onChange={(e) =>
                  onChange({ ...filters, maxReserve: e.target.value === '' ? null : Number(e.target.value) })
                }
                className="w-full rounded-xl border border-surface-line bg-white py-2.5 px-3 font-mono-num text-sm text-ink shadow-sm focus:border-accent-2 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="mt-2 w-full rounded-xl border border-surface-line py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface"
        >
          {t('Filtrlarni tozalash')}
        </button>
      </div>
    </div>
  )
}
