import { Loader2 } from 'lucide-react'
import { useLanguage } from '../i18n'

export function LoadMoreButton({
  onClick,
  loading,
  label = 'Ko‘proq ko‘rish',
}: {
  onClick: () => void
  loading: boolean
  label?: string
}) {
  const { t } = useLanguage()
  return (
    <div className="mt-5 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-surface-line bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-accent-2/50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin text-accent-2" aria-hidden="true" />}
        {loading ? t('Yuklanmoqda…') : t(label)}
      </button>
    </div>
  )
}
