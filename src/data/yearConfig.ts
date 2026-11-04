import type { YearConfig } from '../types'

// Single source of truth for which years exist and where their raw data lives.
// To add a new year: drop the JSON in public/data, write an adapter, and add a line here.
// IMPORTANT: keep these paths in sync with the actual files in public/data/.
export const YEAR_CONFIGS: YearConfig[] = [
  { year: 2025, label: '2025-yil', file: '/data/d7f2a9c1.json' },
  { year: 2024, label: '2024-yil', file: '/data/b3e8140f.json' },
  { year: 2023, label: '2023-yil', file: '/data/a19c5d02.json' },
]

export const DEFAULT_YEAR = 2026

export function getYearConfig(year: number): YearConfig {
  const config = YEAR_CONFIGS.find((c) => c.year === year)
  if (!config) {
    throw new Error(`${year}-yil uchun konfiguratsiya topilmadi`)
  }
  return config
}
