export interface RawEntry2026 {
  id: string
  kind: string
  season: number
  university: string
  branch: string | null
  direction: string | null
  education_form: string | null
  education_language: string | null
  shifr: string | null
  grant_score: number | null
  contract_score: number | null
  quota_total?: number | null
  admitted?: number | null
  free_seats?: number | null
  base_price?: number | null
  base_price_confidence?: string | null
  base_price_rule?: string | null
  subject_1?: string | null
  subject_2?: string | null
  subject_pair_id?: string | null
  source?: string | null
  university_url?: string | null
}

export interface NormalizedProgram extends RawEntry2026 {
  id: string
  season: number
  university: string
}

export function adapt2026(raw: unknown): NormalizedProgram[] {
  const entries = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as { data?: unknown }).data)
      ? (raw as { data: unknown[] }).data
      : []

  return entries.filter((item): item is RawEntry2026 => {
    return !!item && typeof item === 'object' && typeof (item as RawEntry2026).id === 'string'
  }).map((item) => ({
    ...item,
    id: item.id,
    season: Number(item.season) || 2026,
    university: item.university || '',
  }))
}
