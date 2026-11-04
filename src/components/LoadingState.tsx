import { Loader2 } from 'lucide-react'
import { useLanguage } from '../i18n'

export function LoadingState({ label = "Ma'lumotlar yuklanmoqda..." }: { label?: string }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft" role="status" aria-live="polite">
      <Loader2 className="h-6 w-6 animate-spin text-accent-2" aria-hidden="true" />
      <p className="text-sm font-medium">{t(label)}</p>
    </div>
  )
}
