import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, BookOpenCheck } from 'lucide-react'
import { DEFAULT_YEAR } from '../data/yearConfig'
import { useYearData } from '../hooks/useYearData'
import { matchBySubjects, getCompatibleSubjects } from '../services/recommendationEngine'
import { applyCatalogFilters, applySearch, hasActiveCatalogFilters, sortCatalogPrograms } from '../services/filterEngine'
import { DEFAULT_CATALOG_SORT, EMPTY_CATALOG_FILTERS, type CatalogFilters, type CatalogSort, type CatalogSortField } from '../types'
import { YearSelector } from '../components/YearSelector'
import { SubjectSelector } from '../components/SubjectSelector'
import { SearchBar } from '../components/SearchBar'
import { CatalogFilterPanel } from '../components/CatalogFilterPanel'
import { CatalogCard } from '../components/CatalogCard'
import { SortSelect, type SortFieldOption } from '../components/SortSelect'
import { LoadMoreButton } from '../components/LoadMoreButton'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'
import { makeProgramId } from '../utils/normalize'
import { useLanguage } from '../i18n'
import { useAdmission2026 } from '../hooks/useAdmission2026'
import { AdmissionProgramCard } from '../components/Scores2026Page'

const PAGE_SIZE = 12

const CATALOG_SORT_OPTIONS: SortFieldOption<CatalogSortField>[] = [
  { value: 'grantQuota', label: 'Grant kvotasi' },
  { value: 'contractQuota', label: 'Kontrakt kvotasi' },
  { value: 'grantScore', label: 'Grant bali' },
  { value: 'contractScore', label: 'Kontrakt bali' },
]

export function CatalogPage() {
  const { t, language } = useLanguage()
  const [year, setYear] = useState(DEFAULT_YEAR)
  const { programs, subjects, loading, error } = useYearData(year === 2026 ? 2025 : year, year !== 2026)
  const admissions2026 = useAdmission2026(year === 2026)

  const [subject1, setSubject1] = useState('')
  const [subject2, setSubject2] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS)
  const [sort, setSort] = useState<CatalogSort>(DEFAULT_CATALOG_SORT)
  const [filterOpen, setFilterOpen] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)

  function handleYearChange(nextYear: number) {
    setYear(nextYear)
    setSubject1('')
    setSubject2('')
    setFilters(EMPTY_CATALOG_FILTERS)
    setSort(DEFAULT_CATALOG_SORT)
    setSearch('')
    setVisible(PAGE_SIZE)
  }

  const bothSelected = !!subject1 && !!subject2

  // Each selector only offers subjects that actually pair with whatever is
  // chosen in the other field, computed from the real program data — not a
  // fixed list. With neither chosen yet, the full subject list is shown.
  const subject1Options = useMemo(
    () => (subject2 ? getCompatibleSubjects(programs, subject2) : subjects),
    [programs, subjects, subject2],
  )
  const subject2Options = useMemo(
    () => (subject1 ? getCompatibleSubjects(programs, subject1) : subjects),
    [programs, subjects, subject1],
  )

  // If changing one field makes the other's current value no longer a
  // valid pairing, clear it instead of leaving an impossible combination
  // selected.
  useEffect(() => {
    if (subject2 && subject1 && !getCompatibleSubjects(programs, subject1).includes(subject2)) {
      setSubject2('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject1, programs])

  useEffect(() => {
    if (subject1 && subject2 && !getCompatibleSubjects(programs, subject2).includes(subject1)) {
      setSubject1('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject2, programs])

  const matched = useMemo(() => {
    if (!bothSelected) return []
    return matchBySubjects(programs, [subject1, subject2])
  }, [programs, subject1, subject2, bothSelected])

  const searched = useMemo(() => applySearch(matched, search), [matched, search])
  const filtered = useMemo(() => applyCatalogFilters(searched, filters), [searched, filters])
  const sorted = useMemo(() => sortCatalogPrograms(filtered, sort), [filtered, sort])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [sorted])

  function loadMore() {
    setLoadingMore(true)
    setTimeout(() => {
      setVisible((v) => v + PAGE_SIZE)
      setLoadingMore(false)
    }, 400)
  }

  if (year === 2026) {
    const forms = Array.from(new Set(admissions2026.programs.map((item) => item.education_form).filter((v): v is string => !!v))).sort()
    const languages = Array.from(new Set(admissions2026.programs.map((item) => item.education_language).filter((v): v is string => !!v))).sort()
    const query = search.trim().toLocaleLowerCase()
    const current = admissions2026.programs.filter((item) =>
      (!query || [item.university, item.direction, item.shifr, item.branch].some((v) => v?.toLocaleLowerCase().includes(query))) &&
      (!filters.educationType || item.education_form === filters.educationType) &&
      (!filters.language || item.education_language === filters.language) &&
      (!filters.university || item.university === filters.university) &&
      (!filters.offering || filters.offering === 'all' || (filters.offering === 'grant' ? item.grant_score != null : item.contract_score != null))
    )
    return <main className="mx-auto max-w-7xl px-5 py-9 pb-24 sm:px-8 sm:py-12">
      <div className="mb-7 flex items-start gap-4"><span className="icon-tile h-12 w-12"><SlidersHorizontal className="h-6 w-6"/></span><div><p className="eyebrow">ME’ROJ · 2026</p><h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">{t('Fanlar majmuasi')}</h1><p className="mt-2 text-slate-600">{t('Yo‘nalish, ta’lim shakli va tili bo‘yicha qidiring.')}</p></div></div>
      <section className="filter-box grid gap-3 md:grid-cols-[170px_minmax(260px,1fr)_220px_200px_auto] md:items-end">
        <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('Qabul yili')}</span><YearSelector year={year} onChange={handleYearChange}/></label>
        <SearchBar value={search} onChange={setSearch}/>
        <select className="select-control" value={filters.educationType} onChange={(e) => setFilters((v) => ({ ...v, educationType: e.target.value }))} aria-label={t('Ta’lim shakli')}><option value="">{t('Barcha ta’lim shakllari')}</option>{forms.map((v) => <option key={v}>{v}</option>)}</select>
        <select className="select-control" value={filters.language} onChange={(e) => setFilters((v) => ({ ...v, language: e.target.value }))} aria-label={t('Ta’lim tili')}><option value="">{t('Barcha tillar')}</option>{languages.map((v) => <option key={v}>{v}</option>)}</select>
        {(search || filters.educationType || filters.language) && <button className="button-secondary" onClick={() => { setSearch(''); setFilters(EMPTY_CATALOG_FILTERS) }}>{t('Tozalash')}</button>}
      </section>
      <p className="mt-3 rounded-xl border border-blue/15 bg-blue/5 px-4 py-3 text-sm leading-6 text-slate-600">{t('2026 ma’lumotlarida fanlar majmuasi keltirilmagan. Mavjud qabul ma’lumotlarini universitet, yo‘nalish va ta’lim tili bo‘yicha qidiring.')}</p>
      {admissions2026.loading && <div className="py-16"><LoadingState/></div>}
      {admissions2026.error && <div className="mt-5"><ErrorState message={t(admissions2026.error)}/></div>}
      {!admissions2026.loading && !admissions2026.error && <p className="my-5 text-sm text-slate-600"><strong className="text-navy">{current.length}</strong> {t('ta natija')}</p>}
      {!admissions2026.loading && !admissions2026.error && current.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500">{t('Hech narsa topilmadi')}</div>}
      {!admissions2026.loading && !admissions2026.error && <div className="grid gap-4 lg:grid-cols-2">{current.slice(0, visible).map((item) => <AdmissionProgramCard key={item.id} item={item} locale={language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ'} t={t}/>)}</div>}
      {!admissions2026.loading && visible < current.length && <div className="mt-8 text-center"><button className="button-secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>{t('Ko‘proq ko‘rish')}</button></div>}
    </main>
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-9 sm:px-8 sm:pt-12">
      <div className="mb-7 flex items-start gap-4"><span className="icon-tile h-12 w-12"><BookOpenCheck className="h-6 w-6"/></span><div><p className="eyebrow">ME’ROJ · {year}</p><h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">{t('Fanlar majmuasi')}</h1><p className="mt-2 text-slate-600">{t('Ballingiz hali ma’lum bo‘lmasa ham, fanlaringizga mos yo‘nalishlarni grant va kontrakt ma’lumotlari bilan ko‘rib chiqing.')}</p></div></div>

      <div className="glass-strong relative overflow-visible rounded-3xl p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{t('Qabul yili')}</p>
          <YearSelector year={year} onChange={handleYearChange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SubjectSelector
            label="1-fan"
            subjects={subject1Options}
            value={subject1}
            exclude={subject2}
            onChange={setSubject1}
          />
          <SubjectSelector
            label="2-fan"
            subjects={subject2Options}
            value={subject2}
            exclude={subject1}
            onChange={setSubject2}
          />
        </div>
      </div>

      <div className="mt-12">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && !bothSelected && (
          <EmptyState
            title={t('Fanlarni tanlang')}
            description={t('Yo‘nalishlarni ko‘rish uchun ikkala fanni tanlang.')}
          />
        )}

        {!loading && !error && bothSelected && (
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <SearchBar value={search} onChange={setSearch} />
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="relative inline-flex items-center justify-center gap-2 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-accent-2/50"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {t('Filtrlar')}
                {hasActiveCatalogFilters(filters) && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full gradient-bg" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono-num text-sm text-ink-soft">{filtered.length} {t('ta mos yo‘nalish')}</p>
              <SortSelect
                field={sort.field}
                direction={sort.direction}
                fieldOptions={CATALOG_SORT_OPTIONS}
                onFieldChange={(field) => setSort((s) => ({ ...s, field }))}
                onDirectionToggle={() =>
                  setSort((s) => ({ ...s, direction: s.direction === 'desc' ? 'asc' : 'desc' }))
                }
              />
            </div>

            {sorted.length === 0 ? (
              <EmptyState
                title={t('Mos yo‘nalish topilmadi')}
                description={t('Filtrlarni tozalang yoki qidiruvni o‘zgartiring.')}
              />
            ) : (
              <>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sorted.slice(0, visible).map((program) => (
                    <CatalogCard
                      key={makeProgramId(
                        program.universityName,
                        program.directionId,
                        program.educationType,
                        program.language,
                      )}
                      program={program}
                    />
                  ))}
                </ul>
                {visible < sorted.length && <LoadMoreButton onClick={loadMore} loading={loadingMore} />}
              </>
            )}
          </section>
        )}
      </div>

      <CatalogFilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        results={searched}
        filters={filters}
        onChange={setFilters}
      />
    </main>
  )
}
