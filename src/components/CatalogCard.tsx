import { MapPin, GraduationCap, Languages } from 'lucide-react'
import type { Program } from '../types'
import { useLanguage } from '../i18n'

export function CatalogCard({ program }: { program: Program }) {
  const { t } = useLanguage()
  const hasGrant = program.grantScore > 0
  const hasContract = program.contractScore > 0

  return (
    <li className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-surface-line pt-4">
        <div className={`rounded-xl p-3 ${hasGrant ? 'bg-grant-soft' : 'bg-surface'}`}>
          <p className={`text-[11px] font-bold tracking-wide ${hasGrant ? 'text-grant' : 'text-ink-faint'}`}>
            {t('Grant').toLocaleUpperCase()}
          </p>
          {hasGrant ? (
            <>
              <p className="font-mono-num text-lg font-bold text-ink">{program.grantScore.toFixed(1)}</p>
              <p className="text-[11px] text-ink-soft">{t('Kvota')}: {program.grantQuota}</p>
            </>
          ) : (
            <p className="mt-1 text-xs text-ink-faint">{t('Mavjud emas')}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${hasContract ? 'bg-surface' : 'bg-surface'}`}>
          <p className="text-[11px] font-bold tracking-wide text-ink-soft">{t('Kontrakt').toLocaleUpperCase()}</p>
          {hasContract ? (
            <>
              <p className="font-mono-num text-lg font-bold text-ink">{program.contractScore.toFixed(1)}</p>
              <p className="text-[11px] text-ink-soft">{t('Kvota')}: {program.contractQuota}</p>
            </>
          ) : (
            <p className="mt-1 text-xs text-ink-faint">{t('Mavjud emas')}</p>
          )}
        </div>
      </div>
    </li>
  )
}
