import { Link } from 'react-router-dom'
import { ArrowRight, Calculator, ChartNoAxesCombined, BookOpenCheck, SearchCheck, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../i18n'

export function LandingPage() {
  const { t } = useLanguage()
  const cards = [
    { to: '/yonalishlar-2026', icon: ChartNoAxesCombined, title: t('2026-yil qabul ma’lumotlari'), body: t('O‘tgan yillar ma’lumotlari asosida'), number: '01' },
    { to: '/ball-hisoblash', icon: Calculator, title: t('Ball hisoblash'), body: t('Ballingiz qaysi yo‘nalishlarga yetadi?'), number: '02' },
    { to: '/fanlar-majmuasi', icon: BookOpenCheck, title: t('Fanlar majmuasi'), body: t('Fanlar majmuasi'), number: '03' },
  ]
  return <main>
    <section className="hero-section">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <span className="eyebrow"><span className="h-2 w-2 rounded-full bg-teal" />{t('OTM qabul ma’lumotlari')}</span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-navy sm:text-6xl">{t('Ishonchli ma’lumot, aniq reja.')}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t('O‘tish ballari, yo‘nalishlar va fanlar majmuasini qulay ko‘ring. Ballingizni kiriting va mos variantlarni toping.')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/ball-hisoblash" className="button-primary">{t('Ballimni hisoblash')}<ArrowRight className="h-4 w-4" /></Link>
            <Link to="/yonalishlar-2026" className="button-secondary">{t('2026 Ballar')}</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            {[t('O‘tgan yillar ma’lumotlari asosida'), t('OTM, yo‘nalish yoki shifr bo‘yicha qidiring')].map((item, i) => <span key={i} className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal" />{item}</span>)}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[2rem] bg-blue/5" />
          <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal">ME’ROJ</p><p className="mt-1 text-xl font-extrabold text-navy">{t('Qabul ballari')}</p></div><img className="h-14 w-14 rounded-2xl" src="/logo-meroj.png" alt="ME’ROJ" /></div>
            <div className="mt-7 rounded-2xl bg-mist p-4"><div className="flex items-center justify-between text-sm"><span className="font-semibold text-navy">{t('Grant')}</span><span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal">2026</span></div><div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-2 w-3/4 rounded-full bg-blue" /></div><p className="mt-2 text-xs text-slate-500">{t('O‘tgan yillar ma’lumotlari asosida')}</p></div>
            <div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-200 p-4"><SearchCheck className="h-5 w-5 text-blue"/><p className="mt-3 text-xs text-slate-500">{t('Barcha yo‘nalishlar')}</p></div><div className="rounded-2xl border border-slate-200 p-4"><Calculator className="h-5 w-5 text-teal"/><p className="mt-3 text-xs text-slate-500">{t('Ballimni hisoblash')}</p></div></div>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
      <div className="mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow">ME’ROJ · MANDAT</p><h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">{t('Barcha yo‘nalishlar')}</h2></div></div>
      <div className="grid gap-4 md:grid-cols-3">{cards.map(({ to, icon: Icon, title, body, number }) => <Link key={to} to={to} className="feature-card group"><div className="flex items-start justify-between"><span className="icon-tile"><Icon className="h-5 w-5"/></span><span className="text-xs font-bold tracking-widest text-slate-300">{number}</span></div><h3 className="mt-5 text-lg font-bold text-navy">{title}</h3><p className="mt-2 min-h-10 text-sm leading-6 text-slate-600">{body}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue">{t('Batafsil')}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></Link>)}</div>
      <div className="mt-8 flex flex-col justify-between gap-5 rounded-3xl bg-navy px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal">ME’ROJ OMR</p><h2 className="mt-2 text-xl font-bold">{t('Test va javob varaqasi tizimi')}</h2><p className="mt-1 max-w-xl text-sm text-slate-300">{t('O‘qituvchilar uchun OMR asosidagi test va natijalar platformasi.')}</p></div><a href="https://omr.meroj.uz" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-navy transition hover:bg-slate-100">{t('OMR tizimiga o‘tish')}<ArrowRight className="h-4 w-4"/></a></div>
    </section>
  </main>
}
