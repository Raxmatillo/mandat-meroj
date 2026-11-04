import { useEffect, useMemo, useState } from 'react'
import { Search, GraduationCap, MapPin, BookOpen, RotateCcw } from 'lucide-react'
import type { NormalizedProgram } from '../adapters/data2026Adapter'
import { useAdmission2026 } from '../hooks/useAdmission2026'
import { useLanguage } from '../i18n'

const PAGE_SIZE = 30

export function formatNumber(value: number | null | undefined, locale: string) {
  if (value == null || !Number.isFinite(Number(value))) return '—'
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Number(value))
}

export function AdmissionProgramCard({ item, locale, t, userScore }: { item: NormalizedProgram; locale: string; t: (text: string) => string; userScore?: number }) {
  const facts: [string, string | number | null | undefined][] = [
    [t('Ta’lim shakli'), item.education_form], [t('Ta’lim tili'), item.education_language],
    [t('Filial'), item.branch], [t('Shifr'), item.shifr],
  ]
  const meta: [string, number | null | undefined][] = [
    [t('Kvota'), item.quota_total], [t('Qabul qilingan'), item.admitted], [t('Bo‘sh o‘rin'), item.free_seats],
  ]
  return <article className="data-card overflow-hidden">
    <div className="h-1 bg-blue" />
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-blue">{item.university}</p><h2 className="mt-2 text-lg font-bold leading-snug text-navy">{item.direction || t('Yo‘nalish')} {item.shifr && <span className="ml-1 text-sm font-medium text-slate-500">· {item.shifr}</span>}</h2>{item.branch && <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5"/>{item.branch}</p>}</div><span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-navy">{item.season}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-slate-100 pt-4 sm:grid-cols-4">{facts.filter(([, value]) => value).map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-medium text-slate-700">{value}</p></div>)}</div>
      {(item.subject_1 || item.subject_2) && <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600"><BookOpen className="h-4 w-4 shrink-0 text-teal"/><span>{[item.subject_1, item.subject_2].filter(Boolean).join(' · ')}</span></div>}
      <div className="mt-4 flex flex-wrap gap-2">{item.grant_score != null && <div className="score-pill score-pill-grant"><span>{t('Grant bali')}</span><strong>{formatNumber(item.grant_score, locale)}</strong>{userScore != null && <small>{t(userScore >= item.grant_score ? 'Ball yetadi' : 'Ball yetmaydi')} · {formatNumber(Math.abs(userScore-item.grant_score),locale)}</small>}</div>}{item.contract_score != null && <div className="score-pill score-pill-contract"><span>{t('Kontrakt bali')}</span><strong>{formatNumber(item.contract_score, locale)}</strong>{userScore != null && <small>{t(userScore >= item.contract_score ? 'Ball yetadi' : 'Ball yetmaydi')} · {formatNumber(Math.abs(userScore-item.contract_score),locale)}</small>}</div>}</div>
      {(meta.some(([, value]) => value != null) || item.base_price != null) && <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">{meta.filter(([, value]) => value != null).map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-navy">{formatNumber(value, locale)}</p></div>)}{item.base_price != null && <div className="col-span-2 sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('Bazaviy kontrakt narxi')}</p><p className="mt-1 text-sm font-semibold text-navy">{formatNumber(item.base_price, locale)} so‘m</p></div>}</div>}
    </div>
  </article>
}

export function Scores2026Page() {
  const { programs, loading, error } = useAdmission2026()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState('')
  const [language, setLanguage] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { t, language: locale } = useLanguage()

  const forms = useMemo(() => Array.from(new Set(programs.map((p) => p.education_form).filter((v): v is string => !!v))).sort(), [programs])
  const languages = useMemo(() => Array.from(new Set(programs.map((p) => p.education_language).filter((v): v is string => !!v))).sort(), [programs])
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase()
    return programs.filter((p) => (!q || [p.university, p.direction, p.shifr, p.branch].some((v) => v?.toLocaleLowerCase().includes(q))) && (!form || p.education_form === form) && (!language || p.education_language === language))
  }, [programs, search, form, language])

  useEffect(() => setVisible(PAGE_SIZE), [search, form, language])
  const numberLocale = locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US'

  return <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
    <div className="mb-7 flex items-start gap-4"><span className="icon-tile h-12 w-12"><GraduationCap className="h-6 w-6"/></span><div><p className="eyebrow">ME’ROJ · 2026</p><h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">{t('2026-yil qabul ma’lumotlari')}</h1><p className="mt-2 text-slate-600">{t('Yo‘nalish, ta’lim shakli va tili bo‘yicha qidiring.')}</p></div></div>
    <section className="filter-box grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px_200px_auto]">
      <label className="input-wrap"><Search className="h-4 w-4 text-slate-400"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('OTM, yo‘nalish yoki shifr bo‘yicha qidiring')} aria-label={t('Qidirish')}/></label>
      <select className="select-control" value={form} onChange={(e) => setForm(e.target.value)} aria-label={t('Ta’lim shakli')}><option value="">{t('Barcha ta’lim shakllari')}</option>{forms.map((x) => <option key={x}>{x}</option>)}</select>
      <select className="select-control" value={language} onChange={(e) => setLanguage(e.target.value)} aria-label={t('Ta’lim tili')}><option value="">{t('Barcha tillar')}</option>{languages.map((x) => <option key={x}>{x}</option>)}</select>
      {(form || language || search) && <button className="button-secondary" onClick={() => { setSearch(''); setForm(''); setLanguage('') }}><RotateCcw className="h-4 w-4"/>{t('Tozalash')}</button>}
    </section>
    {!loading && !error && <p className="my-5 text-sm text-slate-600"><strong className="text-navy">{formatNumber(filtered.length, numberLocale)}</strong> {t('ta natija')}</p>}
    {loading && <div className="py-16 text-center text-slate-500">{t('Ma’lumot yuklanmoqda…')}</div>}
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800"><p className="font-bold">{t(error)}</p><p className="mt-1 text-sm">{t('Tekshiring: 2026-yil JSON fayli public/data/e8k2n91.json manzilida bo‘lishi kerak.')}</p></div>}
    {!loading && !error && filtered.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500">{t('Hech narsa topilmadi')}</div>}
    {!loading && !error && <div className="grid gap-4 lg:grid-cols-2">{filtered.slice(0, visible).map((item) => <AdmissionProgramCard key={item.id} item={item} locale={numberLocale} t={t}/>)}</div>}
    {!loading && !error && visible < filtered.length && <div className="mt-8 text-center"><button className="button-secondary" onClick={() => setVisible((value) => value + PAGE_SIZE)}>{t('Ko‘proq ko‘rish')} · {Math.min(PAGE_SIZE, filtered.length - visible)}</button></div>}
  </main>
}
