import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '../i18n'

export function ErrorState({ message }: { message: string }) {
  const { t } = useLanguage()
  const displayMessage = message.toLocaleLowerCase().includes('xatolik') ? t('Ma’lumotlarni yuklashda xatolik yuz berdi.') : t(message)
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-warn-soft bg-warn-soft/60 px-6 py-10 text-center"
    >
      <AlertTriangle className="h-6 w-6 text-warn" aria-hidden="true" />
      <p className="text-sm font-medium text-ink">{displayMessage}</p>
    </div>
  )
}
