import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { useLanguage } from './i18n'

const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })))
const ScorePage = lazy(() => import('./pages/ScorePage').then((module) => ({ default: module.ScorePage })))
const CatalogPage = lazy(() => import('./pages/CatalogPage').then((module) => ({ default: module.CatalogPage })))
const Scores2026Page = lazy(() => import('./components/Scores2026Page').then((module) => ({ default: module.Scores2026Page })))

function NotFound() {
  const { t } = useLanguage()
  return <main className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-3xl font-extrabold text-navy">{t('Sahifa topilmadi')}</h1><Link className="button-primary mt-6 inline-flex" to="/">{t('Bosh sahifaga qaytish')}</Link></main>
}

function Footer() {
  const { t } = useLanguage()
  return <footer className="mt-20 border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
      <div><p className="font-semibold text-navy">ME’ROJ — {t('Abituriyentlar uchun')}</p><p className="mt-1 max-w-2xl text-sm text-slate-600">{t('Natijalar o‘tgan yillar statistikasiga asoslangan taxmin.')}</p><p className="mt-3 text-xs text-slate-500">© {new Date().getFullYear()} ME’ROJ · Rakhmatullo Shermatov</p></div>
      <a href="https://omr.meroj.uz" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 transition hover:border-teal-400 hover:bg-teal-100">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal text-white"><GraduationCap className="h-5 w-5" /></span>
        <span><span className="block text-xs font-bold uppercase tracking-wider text-teal">ME’ROJ OMR</span><span className="text-sm font-semibold text-navy">{t('Test va javob varaqasi tizimi')}</span></span><ArrowUpRight className="ml-2 h-4 w-4 text-teal transition group-hover:translate-x-0.5" />
      </a>
    </div>
  </footer>
}

export default function App() {
  return <div className="min-h-screen"><Navbar /><Suspense fallback={<main className="mx-auto max-w-7xl px-5 py-24 text-center text-slate-500" role="status">…</main>}><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/yonalishlar-2026" element={<Scores2026Page />} />
    <Route path="/ball-hisoblash" element={<ScorePage />} />
    <Route path="/fanlar-majmuasi" element={<CatalogPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense><Footer /></div>
}
