import type { ScoredProgram } from '../types'
import { RecommendationCard } from './RecommendationCard'
import { useLanguage } from '../i18n'

export function TopRecommendations({
  recommendations,
  userScore,
}: {
  recommendations: ScoredProgram[]
  userScore: number
}) {
  const { t } = useLanguage()
  return (
    <section aria-labelledby="top5-heading">
      <h2 id="top5-heading" className="font-display text-lg font-extrabold text-ink">
        {t('Siz uchun tanlangan')} <span className="gradient-text">{t('TOP-5 tavsiya')}</span>
      </h2>

      {recommendations.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-surface-line bg-surface px-5 py-6 text-sm text-ink-soft">
          {t('Grant bo‘yicha mos yo‘nalish topilmadi')}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {recommendations[0] && (
            <div className="sm:col-span-2 lg:col-span-2 lg:row-span-1">
              <RecommendationCard program={recommendations[0]} userScore={userScore} rank={0} />
            </div>
          )}
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
            {recommendations.slice(1).map((program, i) => (
              <RecommendationCard key={program.id} program={program} userScore={userScore} rank={i + 1} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
