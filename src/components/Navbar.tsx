import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Languages } from 'lucide-react'
import { useLanguage, type Language } from '../i18n'

const links = [
  { to: '/', label: 'Asosiy', end: true },
  { to: '/yonalishlar-2026', label: '2026 Ballar', end: false },
  { to: '/ball-hisoblash', label: 'Ball hisoblash', end: false },
  { to: '/fanlar-majmuasi', label: 'Fanlar majmuasi', end: false },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="site-header sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label="Main navigation">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <img src="/logo-meroj.png" alt="ME’ROJ" className="h-10 w-10 rounded-xl object-cover" />
          <span className="font-display text-lg font-extrabold tracking-tight text-navy">ME’ROJ<span className="text-blue">.</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              {t(label)}
            </NavLink>
          ))}
        </div>

        <label className="ml-auto flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm text-navy" aria-label={t('Tilni tanlash')}>
          <Languages className="h-4 w-4 text-blue" aria-hidden="true" />
          <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="bg-transparent font-semibold outline-none" aria-label={t('Tilni tanlash')}>
            <option value="uz">O‘zbek</option><option value="ru">Русский</option><option value="en">English</option>
          </select>
        </label>

        <button className="rounded-xl p-2 text-navy hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={t('Menyuni ochish')} aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {mobileOpen && <div className="border-t border-slate-100 bg-white px-4 pb-4 lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 pt-2">
          {links.map(({ to, label, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>{t(label)}</NavLink>)}
        </div>
      </div>}
    </header>
  )
}
