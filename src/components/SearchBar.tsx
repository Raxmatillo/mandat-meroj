import { Search } from 'lucide-react'

import { useLanguage } from '../i18n'

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useLanguage()
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('OTM yoki yo‘nalish bo‘yicha qidiring')}
        aria-label={t('OTM yoki yo‘nalish bo‘yicha qidirish')}
        className="w-full rounded-xl border border-surface-line bg-white py-2.5 pl-9 pr-3.5 text-sm text-ink shadow-sm transition focus:border-accent-2 focus:outline-none"
      />
    </div>
  )
}
