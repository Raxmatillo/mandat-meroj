import { useLanguage } from '../i18n'

export function PlainSelect({
  label,
  value,
  options,
  onChange,
  allLabel = 'Barchasi',
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  allLabel?: string
}) {
  const { t } = useLanguage()
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">{t(label)}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-surface-line bg-white py-2.5 px-3 text-sm text-ink shadow-sm transition focus:border-accent-2 focus:outline-none"
      >
        <option value="">{t(allLabel)}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {t(o)}
          </option>
        ))}
      </select>
    </label>
  )
}
