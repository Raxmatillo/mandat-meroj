import { useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { Program } from '../types'
import { getCompatibleSubjects } from '../services/recommendationEngine'
import { YearSelector } from './YearSelector'
import { SubjectSelector } from './SubjectSelector'
import { ScoreInput } from './ScoreInput'
import { PlainSelect } from './PlainSelect'
import { useLanguage } from '../i18n'

export interface ExamFormValue {
  subject1: string
  subject2: string
  score: string
  region: string
  educationType: string
}

export function ExamForm({
  year,
  onYearChange,
  subjects,
  programs,
  regions,
  educationTypes,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  year: number
  onYearChange: (year: number) => void
  subjects: string[]
  programs: Program[]
  regions: string[]
  educationTypes: string[]
  value: ExamFormValue
  onChange: (value: ExamFormValue) => void
  onSubmit: (parsedScore: number) => void
  disabled?: boolean
}) {
  const { t } = useLanguage()
  const [errors, setErrors] = useState<{ subjects?: string; score?: string }>({})
  const [showOptional, setShowOptional] = useState(false)

  // Each selector only offers subjects that actually pair with whatever is
  // chosen in the other field, computed from the real program data — not a
  // fixed list. With neither chosen yet, the full subject list is shown.
  const subject1Options = useMemo(
    () => (value.subject2 ? getCompatibleSubjects(programs, value.subject2) : subjects),
    [programs, subjects, value.subject2],
  )
  const subject2Options = useMemo(
    () => (value.subject1 ? getCompatibleSubjects(programs, value.subject1) : subjects),
    [programs, subjects, value.subject1],
  )

  function handleSubject1Change(subject1: string) {
    // Clear subject2 if it's no longer a valid pairing with the new subject1.
    const stillValid = !value.subject2 || getCompatibleSubjects(programs, subject1).includes(value.subject2)
    onChange({ ...value, subject1, subject2: stillValid ? value.subject2 : '' })
  }

  function handleSubject2Change(subject2: string) {
    const stillValid = !value.subject1 || getCompatibleSubjects(programs, subject2).includes(value.subject1)
    onChange({ ...value, subject2, subject1: stillValid ? value.subject1 : '' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}

    if (!value.subject1 || !value.subject2) {
      nextErrors.subjects = t('Ikkala fanni ham tanlang')
    } else if (value.subject1 === value.subject2) {
      nextErrors.subjects = t('Fanlar bir xil bo‘lmasligi kerak')
    }

    const normalizedScore = value.score.replace(',', '.')
    const parsedScore = parseFloat(normalizedScore)
    if (!value.score || Number.isNaN(parsedScore)) {
      nextErrors.score = t('Ballni to‘g‘ri kiriting')
    } else if (parsedScore < 0 || parsedScore > 250) {
      nextErrors.score = t('Ball 0 dan 250 gacha bo‘lishi kerak')
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onSubmit(parsedScore)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-3xl border border-surface-line bg-white p-6 shadow-[0_20px_50px_-25px_rgba(49,87,213,0.24)] sm:p-8"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full gradient-bg opacity-10 blur-3xl" aria-hidden="true" />

      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{t('Qabul yili')}</p>
        <YearSelector year={year} onChange={onYearChange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SubjectSelector
          label={t('1-fan')}
          subjects={subject1Options}
          value={value.subject1}
          exclude={value.subject2}
          onChange={handleSubject1Change}
        />
        <SubjectSelector
          label={t('2-fan')}
          subjects={subject2Options}
          value={value.subject2}
          exclude={value.subject1}
          onChange={handleSubject2Change}
        />
      </div>
      {errors.subjects && <p className="mt-2 text-xs font-medium text-warn">{errors.subjects}</p>}

      <div className="mt-4 max-w-[240px]">
        <ScoreInput
          value={value.score}
          onChange={(score) => onChange({ ...value, score })}
          error={errors.score}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowOptional((s) => !s)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-2 hover:underline"
        aria-expanded={showOptional}
      >
        {t('Qo‘shimcha istaklar')}
        <span className="text-ink-faint">({t('Ixtiyoriy')})</span>
        {showOptional ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
      </button>

      {showOptional && (
        <div className="mt-4 grid gap-4 rounded-2xl border border-surface-line bg-surface p-4 sm:grid-cols-2">
          <PlainSelect
            label={t('Qaysi viloyatda o‘qiysiz?')}
            value={value.region}
            options={regions}
            onChange={(region) => onChange({ ...value, region })}
          />
          <PlainSelect
            label={t('Ta’lim shakli')}
            value={value.educationType}
            options={educationTypes}
            onChange={(educationType) => onChange({ ...value, educationType })}
          />
          <p className="text-xs text-ink-soft sm:col-span-2">
            {t('Belgilasangiz, TOP-5 tavsiya va natijalar shu mezonlarga moslab hisoblanadi. To‘ldirilmasa, barchasi hisobga olinadi.')}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 font-display text-sm font-bold text-white shadow-lg shadow-accent-1/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {t('Natijalarni ko‘rish')}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
    </form>
  )
}
