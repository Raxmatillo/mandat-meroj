import type { CatalogFilters, CatalogSort, Filters, Program, ScoredProgram } from '../types'

export function applyFilters(results: ScoredProgram[], filters: Filters): ScoredProgram[] {
  return results.filter((r) => {
    if (filters.university && r.universityName !== filters.university) return false
    if (filters.region && r.region !== filters.region) return false
    if (filters.direction && r.directionName !== filters.direction) return false
    if (filters.educationType && r.educationType !== filters.educationType) return false
    if (filters.language && r.language !== filters.language) return false
    if (filters.type !== 'all' && r.type !== filters.type) return false
    if (filters.minReserve !== null && r.reserve < filters.minReserve) return false
    if (filters.maxReserve !== null && r.reserve > filters.maxReserve) return false
    return true
  })
}

// Generic over Program so it works for both scored results (ResultsPage)
// and plain catalog entries (CatalogPage) without duplicating the search.
export function applySearch<T extends Program>(results: T[], query: string): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return results
  return results.filter(
    (r) =>
      r.universityName.toLowerCase().includes(q) ||
      r.directionName.toLowerCase().includes(q),
  )
}

export function hasActiveFilters(filters: Filters): boolean {
  return (
    !!filters.university ||
    !!filters.region ||
    !!filters.direction ||
    !!filters.educationType ||
    !!filters.language ||
    filters.type !== 'all' ||
    filters.minReserve !== null ||
    filters.maxReserve !== null
  )
}

/**
 * Restricts the raw program list to a chosen region and/or education type
 * before matching happens. Used for the optional "which region / which
 * study form" fields on the exam form: when set, TOP-5 and every result
 * are computed only within that scope; when left blank, nothing is
 * restricted (spec: "to'ldirilmasa barchasida turadi").
 */
export function filterByCriteria(
  programs: Program[],
  criteria: { region?: string; educationType?: string },
): Program[] {
  return programs.filter((p) => {
    if (criteria.region && p.region !== criteria.region) return false
    if (criteria.educationType && p.educationType !== criteria.educationType) return false
    return true
  })
}

// Filters for the subject-catalog page ("Fanlar majmuasi"). "offering"
// checks whether the program has a grant and/or contract slot at all,
// since there's no user score to classify against here.
export function applyCatalogFilters(results: Program[], filters: CatalogFilters): Program[] {
  return results.filter((r) => {
    if (filters.university && r.universityName !== filters.university) return false
    if (filters.region && r.region !== filters.region) return false
    if (filters.educationType && r.educationType !== filters.educationType) return false
    if (filters.language && r.language !== filters.language) return false
    if (filters.offering === 'grant' && r.grantScore <= 0) return false
    if (filters.offering === 'contract' && r.contractScore <= 0) return false
    return true
  })
}

// Sorts the catalog list by one of grantScore / contractScore / grantQuota /
// contractQuota, in either direction. Used by the compact sort control next
// to the "N ta mos yo'nalish" count line on the catalog page.
export function sortCatalogPrograms(programs: Program[], sort: CatalogSort): Program[] {
  return [...programs].sort((a, b) => {
    const diff = a[sort.field] - b[sort.field]
    return sort.direction === 'desc' ? -diff : diff
  })
}

export function hasActiveCatalogFilters(filters: CatalogFilters): boolean {
  return (
    !!filters.university ||
    !!filters.region ||
    !!filters.educationType ||
    !!filters.language ||
    filters.offering !== 'all'
  )
}