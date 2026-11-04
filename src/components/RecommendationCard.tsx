import { MapPin, GraduationCap, Languages, Trophy } from 'lucide-react'
import type { ScoredProgram } from '../types'
import { ReserveGauge } from './ReserveGauge'
import { useLanguage } from '../i18n'

const RANK_STYLES = [
  { ring: 'ring-2 ring-gold/40', badge: 'bg-gold-soft text-gold', label: '#1', tone: 'border-gold/30' },
  { ring: 'ring-1 ring-silver/30', badge: 'bg-silver-soft text-silver', label: '#2', tone: 'border-surface-line' },
  { ring: 'ring-1 ring-bronze/30', badge: 'bg-bronze-soft text-bronze', label: '#3', tone: 'border-surface-line' },
  { ring: '', badge: 'bg-surface text-ink-soft', label: '#4', tone: 'border-surface-line' },
  { ring: '', badge: 'bg-surface text-ink-soft', label: '#5', tone: 'border-surface-line' },
]

export function RecommendationCard({
  program,
  userScore,
  rank,
}: {
  program: ScoredProgram
  userScore: number
  rank: number
}) {
  const { t } = useLanguage()
  const style = RANK_STYLES[rank] ?? RANK_STYLES[4]
  const isTop = rank === 0

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${style.ring} ${style.tone} ${
        isTop ? 'sm:p-6' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}>
          {isTop && <Trophy className="h-3 w-3" aria-hidden="true" />}
          TOP-{rank + 1}
        </span>
        <span className="rounded-full bg-grant-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-grant">
          {t('Grant').toLocaleUpperCase()}
        </span>
      </div>

      <h3 className={`font-display font-bold leading-snug text-ink ${isTop ? 'text-lg' : 'text-base'}`}>
        {program.universityName}
      </h3>
      <p className="mt-0.5 text-sm text-ink-soft">{program.directionName}</p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink-faint">
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

      <div className="mt-4 flex-1 border-t border-surface-line pt-4">
        <ReserveGauge passingScore={program.grantScore} userScore={userScore} reserve={program.reserve} />
      </div>

      <p className="mt-3 font-mono-num text-xs text-ink-faint">{t('Grant kvotasi')}: {program.grantQuota}</p>
    </div>
  )
}
