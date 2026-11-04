import type { Program, ScoredProgram, SortDirection } from '../types'
import { calculateReserve } from '../utils/calculations'
import { makeProgramId } from '../utils/normalize'

export { calculateReserve }

function subjectsMatch(programSubjects: string[], selectedSubjects: string[]): boolean {
  if (selectedSubjects.length === 0) return false
  const normalized = programSubjects.map((s) => s.toLowerCase().trim())
  return selectedSubjects.every((s) => normalized.includes(s.toLowerCase().trim()))
}

/**
 * Given one already-chosen subject, returns only the subjects that actually
 * co-occur with it in at least one program's required-subjects pair —
 * computed straight from the data rather than a fixed list, so picking
 * "Matematika" only offers subjects real programs actually pair it with
 * (e.g. Fizika, Kimyo, Informatika), never an incompatible pairing like
 * "Kasbiy-ijodiy imtihon".
 */
export function getCompatibleSubjects(data: Program[], subject: string): string[] {
  if (!subject) return []
  const normalizedSubject = subject.toLowerCase().trim()
  const found = new Set<string>()

  for (const program of data) {
    const normalized = program.subjects.map((s) => s.toLowerCase().trim())
    if (!normalized.includes(normalizedSubject)) continue
    for (const s of program.subjects) {
      const n = s.toLowerCase().trim()
      if (s && n !== normalizedSubject) found.add(s)
    }
  }

  return Array.from(found).sort((a, b) => a.localeCompare(b, 'uz'))
}

/**
 * Score-independent version of the matching used by getMatchedResults —
 * returns every program for the chosen subject pair regardless of a
 * user's score, for the subject catalog browsing page ("Fanlar majmuasi").
 */
export function matchBySubjects(data: Program[], selectedSubjects: string[]): Program[] {
  const results: Program[] = []
  const seen = new Set<string>()

  for (const program of data) {
    if (!subjectsMatch(program.subjects, selectedSubjects)) continue
    const id = makeProgramId(
      program.universityName,
      program.directionId,
      program.educationType,
      program.language,
    )
    if (seen.has(id)) continue
    seen.add(id)
    results.push(program)
  }

  return results
}

/**
 * Filters programs to those matching the user's two chosen subjects, then
 * classifies each as grant / contract / not-eligible based on the user's
 * score. Only grant and contract results are returned — not_eligible rows
 * are dropped here, per spec section 6.
 *
 * Programs with grantScore === 0 are treated as having no grant offering;
 * same for contractScore === 0 (spec section 23, edge cases 1–2).
 */
export function getMatchedResults(
  data: Program[],
  userScore: number,
  selectedSubjects: string[],
): ScoredProgram[] {
  const results: ScoredProgram[] = []
  const seen = new Set<string>()

  for (const program of data) {
    if (!subjectsMatch(program.subjects, selectedSubjects)) continue

    const id = makeProgramId(
      program.universityName,
      program.directionId,
      program.educationType,
      program.language,
    )
    // Section 23 edge case: same direction name can exist at multiple
    // universities — dedupe by the full composite id, not by name alone.
    if (seen.has(id)) continue

    const hasGrant = program.grantScore > 0
    const hasContract = program.contractScore > 0

    if (hasGrant && userScore >= program.grantScore) {
      seen.add(id)
      results.push({
        ...program,
        id,
        type: 'grant',
        reserve: calculateReserve(userScore, program.grantScore),
      })
    } else if (hasContract && userScore >= program.contractScore) {
      seen.add(id)
      results.push({
        ...program,
        id,
        type: 'contract',
        reserve: calculateReserve(userScore, program.contractScore),
      })
    }
    // else: not_eligible — intentionally excluded from results
  }

  return results
}

export function getGrantResults(results: ScoredProgram[]): ScoredProgram[] {
  return results.filter((r) => r.type === 'grant')
}

export function getContractResults(results: ScoredProgram[]): ScoredProgram[] {
  return results.filter((r) => r.type === 'contract')
}

export function sortGrantResults(results: ScoredProgram[]): ScoredProgram[] {
  return [...results].sort(
    (a, b) =>
      b.reserve - a.reserve ||
      b.grantQuota - a.grantQuota ||
      b.grantScore - a.grantScore,
  )
}

export function sortContractResults(results: ScoredProgram[]): ScoredProgram[] {
  return [...results].sort(
    (a, b) =>
      b.reserve - a.reserve ||
      b.contractQuota - a.contractQuota ||
      b.contractScore - a.contractScore,
  )
}

// Re-sorts an already grant- or contract-only list by that offering's own
// score or quota field. Used only when the user picks something other than
// "Standart" in the results page sort control — the default ordering still
// goes through sortGrantResults / sortContractResults above.
export function sortByField(
  results: ScoredProgram[],
  offering: 'grant' | 'contract',
  field: 'score' | 'quota',
  direction: SortDirection,
): ScoredProgram[] {
  const key =
    field === 'score'
      ? offering === 'grant'
        ? 'grantScore'
        : 'contractScore'
      : offering === 'grant'
        ? 'grantQuota'
        : 'contractQuota'

  return [...results].sort((a, b) => {
    const diff = a[key] - b[key]
    return direction === 'desc' ? -diff : diff
  })
}

export function getTopRecommendations(
  sortedGrantResults: ScoredProgram[],
  limit = 5,
): ScoredProgram[] {
  return sortedGrantResults.slice(0, limit)
}