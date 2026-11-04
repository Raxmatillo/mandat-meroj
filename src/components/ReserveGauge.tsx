import { reserveLevel } from '../utils/calculations'
import { useLanguage } from '../i18n'

const LEVEL_LABEL: Record<ReturnType<typeof reserveLevel>, string> = {
  high: 'Yuqori zaxira',
  medium: "O'rtacha zaxira",
  low: 'Past zaxira',
}

const LEVEL_CLASSES: Record<ReturnType<typeof reserveLevel>, { bar: string; text: string; chip: string }> = {
  high: { bar: 'bg-grant', text: 'text-grant', chip: 'bg-grant-soft text-grant' },
  medium: { bar: 'bg-warn', text: 'text-warn', chip: 'bg-warn-soft text-warn' },
  low: { bar: 'bg-warn', text: 'text-warn', chip: 'bg-warn-soft text-warn' },
}

/**
 * Renders the cutoff score and the user's score on one axis, with the gap
 * between them filled in. This is the app's signature element — every
 * result card uses it, so "how much room do I have" always reads the same
 * visual way, like a scoreboard rather than a plain number.
 */
export function ReserveGauge({
  passingScore,
  userScore,
  reserve,
}: {
  passingScore: number
  userScore: number
  reserve: number
}) {
  const { t } = useLanguage()
  const level = reserveLevel(reserve)
  const classes = LEVEL_CLASSES[level]
  // Position the cutoff mark and fill width relative to a padded range so
  // the bar always has visual breathing room on both ends.
  const span = Math.max(reserve, 10) * 1.6
  const cutoffPct = Math.min(92, Math.max(8, (span - reserve) / span * 100))
  const fillPct = 100 - cutoffPct

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="font-mono-num text-ink-soft">
          {t('O‘tish balli')} <span className="text-ink">{passingScore.toFixed(1)}</span>
        </span>
        <span className="font-mono-num text-ink-soft">
          {t('Sizning ballingiz')} <span className="font-semibold text-ink">{userScore.toFixed(1)}</span>
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-surface-line" aria-hidden="true">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-ink-faint/40"
          style={{ width: `${cutoffPct}%` }}
        />
        <div
          className={`absolute top-0 h-2 rounded-full ${classes.bar}`}
          style={{ left: `${cutoffPct}%`, width: `${fillPct}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-ink/70"
          style={{ left: `${cutoffPct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${classes.chip}`}>
          {t(LEVEL_LABEL[level])}
        </span>
        <span className={`font-mono-num text-sm font-bold ${classes.text}`}>
          {reserve >= 0 ? '+' : ''}
          {reserve.toFixed(1)} {t('ball zaxira')}
        </span>
      </div>
    </div>
  )
}
