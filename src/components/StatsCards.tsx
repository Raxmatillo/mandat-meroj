import { useLanguage } from '../i18n'

export type StatFilter = 'all' | 'grant' | 'contract'

export function StatsCards({
  total,
  grantCount,
  contractCount,
  active,
  onSelect,
}: {
  total: number
  grantCount: number
  contractCount: number
  active: StatFilter
  onSelect: (filter: StatFilter) => void
}) {
  const { t } = useLanguage()
  const items: { key: StatFilter; label: string; value: number; activeClass: string }[] = [
    { key: 'all', label: t('Jami mos yo‘nalishlar'), value: total, activeClass: 'gradient-bg text-white' },
    { key: 'grant', label: 'Grant', value: grantCount, activeClass: 'bg-grant text-white' },
    { key: 'contract', label: 'Kontrakt', value: contractCount, activeClass: 'bg-ink text-white' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3" role="group" aria-label={t('Natijalar statistikasi')}>
      {items.map((item) => {
        const isActive = active === item.key
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={isActive}
            className={`rounded-2xl border px-4 py-3.5 text-left shadow-sm transition ${
              isActive
                ? `border-transparent ${item.activeClass}`
                : 'border-surface-line bg-white text-ink hover:border-accent-2/50'
            }`}
          >
            <span className={`block font-mono-num text-2xl font-bold ${isActive ? '' : 'text-ink'}`}>
              {item.value}
            </span>
            <span className={`mt-0.5 block text-xs font-medium ${isActive ? 'text-white/85' : 'text-ink-soft'}`}>
              {t(item.label)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
