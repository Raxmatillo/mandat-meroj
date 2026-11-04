import { useLanguage } from '../i18n'

export function ScoreInput({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const { t } = useLanguage()
  return (
    <div>
      <label htmlFor="score-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {t('Ball')}
      </label>
      <input
        id="score-input"
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={t('Masalan: 165.4')}
        onChange={(e) => {
          const v = e.target.value
          if (v === '' || /^\d{0,3}([.,]\d{0,2})?$/.test(v)) {
            onChange(v)
          }
        }}
        aria-invalid={!!error}
        aria-describedby={error ? 'score-error' : undefined}
        className={`w-full rounded-xl border bg-white py-2.5 px-3.5 font-mono-num text-sm text-ink shadow-sm transition focus:outline-none ${
          error ? 'border-warn focus:border-warn' : 'border-surface-line focus:border-accent-2'
        }`}
      />
      {error && (
        <p id="score-error" className="mt-1.5 text-xs font-medium text-warn">
          {error}
        </p>
      )}
    </div>
  )
}
