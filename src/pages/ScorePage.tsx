import { useMemo, useState } from 'react'
import { Search, Calculator } from 'lucide-react'
import { DEFAULT_YEAR } from '../data/yearConfig'
import { useYearData } from '../hooks/useYearData'
import { useAdmission2026 } from '../hooks/useAdmission2026'
import { getMatchedResults } from '../services/recommendationEngine'
import { filterByCriteria } from '../services/filterEngine'
import { ExamForm, type ExamFormValue } from '../components/ExamForm'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { ResultsPage } from '../components/ResultsPage'
import { YearSelector } from '../components/YearSelector'
import { ScoreInput } from '../components/ScoreInput'
import { AdmissionProgramCard } from '../components/Scores2026Page'
import { useLanguage } from '../i18n'

const EMPTY_FORM: ExamFormValue = { subject1: '', subject2: '', score: '', region: '', educationType: '' }
const PAGE_SIZE = 30

export function ScorePage() {
  const { t, language } = useLanguage()
  const [year, setYear] = useState(DEFAULT_YEAR)
  const historical = useYearData(year === 2026 ? 2025 : year, year !== 2026)
  const admissions = useAdmission2026(year === 2026)
  const [formValue, setFormValue] = useState<ExamFormValue>(EMPTY_FORM)
  const [submission, setSubmission] = useState<{ score: number; subjects: string[]; region: string; educationType: string } | null>(null)
  const [search2026, setSearch2026] = useState('')
  const [form2026, setForm2026] = useState('')
  const [language2026, setLanguage2026] = useState('')
  const [calculated2026, setCalculated2026] = useState(false)
  const [visible2026, setVisible2026] = useState(PAGE_SIZE)

  function handleYearChange(nextYear: number) {
    setYear(nextYear)
    setFormValue(EMPTY_FORM)
    setSubmission(null)
    setCalculated2026(false)
    setSearch2026('')
    setForm2026('')
    setLanguage2026('')
    setVisible2026(PAGE_SIZE)
  }

  function handleSubmit(score: number) {
    setSubmission({ score, subjects: [formValue.subject1, formValue.subject2], region: formValue.region, educationType: formValue.educationType })
  }

  const matched = useMemo(() => {
    if (!submission) return []
    const scoped = filterByCriteria(historical.programs, { region: submission.region, educationType: submission.educationType })
    return getMatchedResults(scoped, submission.score, submission.subjects)
  }, [historical.programs, submission])

  const admissionForms = useMemo(() => Array.from(new Set(admissions.programs.map((row) => row.education_form).filter((value): value is string => !!value))).sort(), [admissions.programs])
  const admissionLanguages = useMemo(() => Array.from(new Set(admissions.programs.map((row) => row.education_language).filter((value): value is string => !!value))).sort(), [admissions.programs])
  const userScore = Number.parseFloat(formValue.score.replace(',', '.'))
  const scoreIsValid = Number.isFinite(userScore) && userScore >= 0 && userScore <= 250
  const filtered2026 = useMemo(() => {
    const q = search2026.trim().toLocaleLowerCase()
    return admissions.programs.filter((row) => (!q || [row.university, row.direction, row.shifr, row.branch].some((value) => value?.toLocaleLowerCase().includes(q))) && (!form2026 || row.education_form === form2026) && (!language2026 || row.education_language === language2026))
      .sort((a, b) => {
        const aMargins = [a.grant_score, a.contract_score].filter((v): v is number => v != null).map((v) => userScore - v)
        const bMargins = [b.grant_score, b.contract_score].filter((v): v is number => v != null).map((v) => userScore - v)
        const aBest = Math.max(...aMargins, Number.NEGATIVE_INFINITY)
        const bBest = Math.max(...bMargins, Number.NEGATIVE_INFINITY)
        return bBest - aBest
      })
  }, [admissions.programs, search2026, form2026, language2026, userScore])
  const numberLocale = language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ'

  return <main className="mx-auto max-w-7xl px-5 py-9 pb-24 sm:px-8 sm:py-12">
    <div className="mb-7 flex items-start gap-4"><span className="icon-tile h-12 w-12"><Calculator className="h-6 w-6"/></span><div><p className="eyebrow">ME’ROJ · {year}</p><h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">{t('Ball hisoblash')}</h1><p className="mt-2 text-slate-600">{t('Ballingiz qaysi yo‘nalishlarga yetadi?')}</p></div></div>
    {year === 2026 ? <>
      <section className="filter-box grid gap-4 lg:grid-cols-[180px_190px_minmax(240px,1fr)_220px_200px_auto] lg:items-end">
        <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('Qabul yili')}</span><YearSelector year={year} onChange={handleYearChange}/></label>
        <ScoreInput value={formValue.score} onChange={(score) => { setFormValue((value) => ({ ...value, score })); setCalculated2026(false) }}/>
        <label className="input-wrap"><Search className="h-4 w-4 text-slate-400"/><input value={search2026} onChange={(event) => setSearch2026(event.target.value)} placeholder={t('OTM, yo‘nalish yoki shifr bo‘yicha qidiring')}/></label>
        <select className="select-control" value={form2026} onChange={(event) => setForm2026(event.target.value)} aria-label={t('Ta’lim shakli')}><option value="">{t('Barcha ta’lim shakllari')}</option>{admissionForms.map((value) => <option key={value}>{value}</option>)}</select>
        <select className="select-control" value={language2026} onChange={(event) => setLanguage2026(event.target.value)} aria-label={t('Ta’lim tili')}><option value="">{t('Barcha tillar')}</option>{admissionLanguages.map((value) => <option key={value}>{value}</option>)}</select>
        <button className="button-primary" type="button" disabled={!scoreIsValid} onClick={() => { setCalculated2026(true); setVisible2026(PAGE_SIZE) }}>{t('Hisoblash')}</button>
      </section>
      <p className="mt-3 rounded-xl border border-blue/15 bg-blue/5 px-4 py-3 text-sm leading-6 text-slate-600">{t('2026 ma’lumotlarida fanlar majmuasi mavjud emas. O‘tish ballari bo‘yicha universitet va yo‘nalishlarni qidiring.')}</p>
      {admissions.loading && <div className="py-16"><LoadingState/></div>}
      {admissions.error && <div className="mt-6"><ErrorState message={t(admissions.error)}/></div>}
      {!admissions.loading && !admissions.error && calculated2026 && <>
        <p className="my-5 text-sm text-slate-600"><strong className="text-navy">{new Intl.NumberFormat(numberLocale).format(filtered2026.length)}</strong> {t('ta natija')} · {t('Ballingiz')}: <strong>{userScore.toFixed(1)}</strong></p>
        {filtered2026.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500">{t('Hech narsa topilmadi')}</div> : <div className="grid gap-4 lg:grid-cols-2">{filtered2026.slice(0, visible2026).map((item) => <AdmissionProgramCard key={item.id} item={item} locale={numberLocale} t={t} userScore={userScore}/>)}</div>}
        {visible2026 < filtered2026.length && <div className="mt-8 text-center"><button className="button-secondary" onClick={() => setVisible2026((value) => value + PAGE_SIZE)}>{t('Ko‘proq ko‘rish')}</button></div>}
      </>}
    </> : <>
      <ExamForm year={year} onYearChange={handleYearChange} subjects={historical.subjects} programs={historical.programs} regions={historical.regions} educationTypes={historical.educationTypes} value={formValue} onChange={setFormValue} onSubmit={handleSubmit} disabled={historical.loading || !!historical.error}/>
      <div className="mt-12">{historical.loading && <LoadingState/>}{!historical.loading && historical.error && <ErrorState message={historical.error}/ >}{!historical.loading && !historical.error && submission && <ResultsPage matched={matched} userScore={submission.score}/>}</div>
    </>}
  </main>
}
