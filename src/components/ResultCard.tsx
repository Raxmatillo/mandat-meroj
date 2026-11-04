import { MapPin, GraduationCap, Languages } from 'lucide-react'
import type { ScoredProgram } from '../types'
import { ReserveGauge } from './ReserveGauge'
import { useLanguage } from '../i18n'

export function ResultCard({ program, userScore }: { program: ScoredProgram; userScore: number }) {
  const { t } = useLanguage()
  const isGrant = program.type === 'grant'
  const passingScore = isGrant ? program.grantScore : program.contractScore
  const quota = isGrant ? program.grantQuota : program.contractQuota

  return (
    <li className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
            isGrant ? 'bg-grant-soft text-grant' : 'bg-surface text-ink-soft'
          }`}
        >
          {t(isGrant ? 'Grant' : 'Kontrakt').toLocaleUpperCase()}
        </span>
        <span className="font-mono-num text-xs text-ink-faint">{t('Kvota')}: {quota}</span>
      </div>

      <h3 className="font-display text-base font-bold leading-snug text-ink">{program.universityName}</h3>
      <p className="mt-0.5 text-sm text-ink-soft">{program.directionName}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-faint">
        {program.region && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {program.region}
          </span>
        )}
        {program.educationType && (
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> {program.educationType}
          </span>
        )}
        {program.language && (
          <span className="inline-flex items-center gap-1">
            <Languages className="h-3.5 w-3.5" aria-hidden="true" /> {program.language}
          </span>
        )}
      </div>

      <div className="mt-4 border-t border-surface-line pt-4">
        <ReserveGauge passingScore={passingScore} userScore={userScore} reserve={program.reserve} />
      </div>
    </li>
  )
}
