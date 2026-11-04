import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { Filters, ResultSort, ScoredProgram } from '../types'
import { DEFAULT_RESULT_SORT, EMPTY_FILTERS } from '../types'
import {
  getGrantResults,
  getContractResults,
  sortGrantResults,
  sortContractResults,
  sortByField,
  getTopRecommendations,
} from '../services/recommendationEngine'
import { applyFilters, applySearch, hasActiveFilters } from '../services/filterEngine'
import { StatsCards, type StatFilter } from './StatsCards'
import { SearchBar } from './SearchBar'
import { FilterPanel } from './FilterPanel'
import { TopRecommendations } from './TopRecommendations'
import { ResultCard } from './ResultCard'
import { EmptyState } from './EmptyState'
import { LoadMoreButton } from './LoadMoreButton'
import { SortSelect, type SortFieldOption } from './SortSelect'
import { useLanguage } from '../i18n'

const RESULT_SORT_OPTIONS: SortFieldOption<ResultSort['field']>[] = [
  { value: 'default', label: 'Standart' },
  { value: 'quota', label: 'Kvota' },
  { value: 'score', label: 'Ball' },
]

const PAGE_SIZE = 12

export function ResultsPage({ matched, userScore }: { matched: ScoredProgram[]; userScore: number }) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [grantSort, setGrantSort] = useState<ResultSort>(DEFAULT_RESULT_SORT)
  const [contractSort, setContractSort] = useState<ResultSort>(DEFAULT_RESULT_SORT)

  // Section 10: filters are applied to already-matched results, then
  // default sorting is re-applied — filtering and sorting never mix logic.
  const searched = useMemo(() => applySearch(matched, search), [matched, search])
  const filtered = useMemo(() => applyFilters(searched, filters), [searched, filters])

  const grantSorted = useMemo(() => sortGrantResults(getGrantResults(filtered)), [filtered])
  const contractSorted = useMemo(() => sortContractResults(getContractResults(filtered)), [filtered])

  // TOP-5 is recomputed from the filtered grant results (section 10, point 4).
  // This stays on the stable default order regardless of the sort control
  // below, so TOP-5 membership never shifts when someone just re-sorts
  // the list underneath it.
  const top5 = useMemo(() => getTopRecommendations(grantSorted, 5), [grantSorted])
  const top5Ids = useMemo(() => new Set(top5.map((p) => p.id)), [top5])
  const grantRestDefault = useMemo(() => grantSorted.filter((p) => !top5Ids.has(p.id)), [grantSorted, top5Ids])

  // The sort control only re-orders what's actually displayed below TOP-5 /
  // below the contract heading — "Standart" keeps the existing reserve-based
  // ordering, "Ball" / "Kvota" re-sort by that field instead.
  const grantRest = useMemo(
    () =>
      grantSort.field === 'default'
        ? grantRestDefault
        : sortByField(grantRestDefault, 'grant', grantSort.field, grantSort.direction),
    [grantRestDefault, grantSort],
  )

  const contractDisplayed = useMemo(
    () =>
      contractSort.field === 'default'
        ? contractSorted
        : sortByField(contractSorted, 'contract', contractSort.field, contractSort.direction),
    [contractSorted, contractSort],
  )

  const total = grantSorted.length + contractSorted.length

  // "Ko'proq" pagination — each list starts at PAGE_SIZE and grows by
  // PAGE_SIZE per click, with a short loading state before appending.
  const [grantVisible, setGrantVisible] = useState(PAGE_SIZE)
  const [contractVisible, setContractVisible] = useState(PAGE_SIZE)
  const [grantLoadingMore, setGrantLoadingMore] = useState(false)
  const [contractLoadingMore, setContractLoadingMore] = useState(false)

  // Reset pagination whenever the underlying result set changes (new
  // search, filter, or submission) so page 1 is always shown first.
  useEffect(() => {
    setGrantVisible(PAGE_SIZE)
    setContractVisible(PAGE_SIZE)
  }, [grantRest, contractDisplayed])

  function loadMoreGrant() {
    setGrantLoadingMore(true)
    setTimeout(() => {
      setGrantVisible((v) => v + PAGE_SIZE)
      setGrantLoadingMore(false)
    }, 400)
  }

  function loadMoreContract() {
    setContractLoadingMore(true)
    setTimeout(() => {
      setContractVisible((v) => v + PAGE_SIZE)
      setContractLoadingMore(false)
    }, 400)
  }

  function handleStatSelect(stat: StatFilter) {
    setFilters((prev) => ({ ...prev, type: stat === 'all' ? 'all' : stat }))
  }

  const activeStat: StatFilter = filters.type

  return (
    <section className="space-y-8">
      <StatsCards
        total={total}
        grantCount={grantSorted.length}
        contractCount={contractSorted.length}
        active={activeStat}
        onSelect={handleStatSelect}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} />
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="relative inline-flex items-center justify-center gap-2 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-accent-2/50"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {t('Filtrlar')}
          {hasActiveFilters(filters) && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full gradient-bg" aria-hidden="true" />
          )}
        </button>
      </div>

      {total === 0 ? (
        <EmptyState
          title={t('Mos yo‘nalish topilmadi')}
          description={t('Fanlaringiz yoki ballingiz bo‘yicha yo‘nalish topilmadi. Filtrlarni tozalang va qayta urinib ko‘ring.')}
        />
      ) : (
        <>
          <TopRecommendations recommendations={top5} userScore={userScore} />

          <section aria-labelledby="grant-list-heading">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="grant-list-heading" className="font-display text-base font-bold text-ink">
                {t('Grant asosida kirish mumkin bo‘lgan yo‘nalishlar')}
              </h2>
              {grantRest.length > 0 && (
                <SortSelect
                  field={grantSort.field}
                  direction={grantSort.direction}
                  fieldOptions={RESULT_SORT_OPTIONS}
                  hideDirectionWhen="default"
                  onFieldChange={(field) => setGrantSort((s) => ({ ...s, field }))}
                  onDirectionToggle={() =>
                    setGrantSort((s) => ({ ...s, direction: s.direction === 'desc' ? 'asc' : 'desc' }))
                  }
                />
              )}
            </div>
            {grantRest.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">{t('Qo‘shimcha grant yo‘nalishlari yo‘q.')}</p>
            ) : (
              <>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grantRest.slice(0, grantVisible).map((program) => (
                    <ResultCard key={program.id} program={program} userScore={userScore} />
                  ))}
                </ul>
                {grantVisible < grantRest.length && (
                  <LoadMoreButton onClick={loadMoreGrant} loading={grantLoadingMore} />
                )}
              </>
            )}
          </section>

          <section aria-labelledby="contract-list-heading">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="contract-list-heading" className="font-display text-base font-bold text-ink">
                {t('Kontrakt asosida kirish mumkin bo‘lgan yo‘nalishlar')}
              </h2>
              {contractDisplayed.length > 0 && (
                <SortSelect
                  field={contractSort.field}
                  direction={contractSort.direction}
                  fieldOptions={RESULT_SORT_OPTIONS}
                  hideDirectionWhen="default"
                  onFieldChange={(field) => setContractSort((s) => ({ ...s, field }))}
                  onDirectionToggle={() =>
                    setContractSort((s) => ({ ...s, direction: s.direction === 'desc' ? 'asc' : 'desc' }))
                  }
                />
              )}
            </div>
            {contractDisplayed.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">{t('Kontrakt yo‘nalishlari topilmadi.')}</p>
            ) : (
              <>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {contractDisplayed.slice(0, contractVisible).map((program) => (
                    <ResultCard key={program.id} program={program} userScore={userScore} />
                  ))}
                </ul>
                {contractVisible < contractDisplayed.length && (
                  <LoadMoreButton onClick={loadMoreContract} loading={contractLoadingMore} />
                )}
              </>
            )}
          </section>
        </>
      )}

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        results={searched}
        filters={filters}
        onChange={setFilters}
      />
    </section>
  )
}
