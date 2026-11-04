// Small, defensive coercion helpers. Adapters funnel every raw field through
// these so a missing/malformed value in the source JSON never crashes the app.

export function toStr(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

export function toNum(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0
  const n = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function toSubjects(...values: unknown[]): string[] {
  return values
    .map((v) => toStr(v))
    .filter((v) => v.length > 0)
}

// Some year formats store both subjects in a single delimited field
// (e.g. "Tarix, Matematika") rather than two separate fields.
export function splitSubjects(value: unknown): string[] {
  return toStr(value)
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function slugify(value: string): string {
  return toStr(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function makeProgramId(
  universityName: string,
  directionId: string,
  educationType: string,
  language: string,
): string {
  return [universityName, directionId, educationType, language]
    .map((p) => toStr(p).toLowerCase())
    .join('::')
}
