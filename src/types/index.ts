// Normalized shape every year's data gets converted into.
// UI and business logic only ever touch this shape — never the raw year JSON.
export interface Program {
  universityName: string
  universitySlug: string
  region: string
  directionId: string
  directionName: string
  educationType: string
  language: string
  subjects: string[]
  grantScore: number
  contractScore: number
  grantQuota: number
  contractQuota: number
  year: number
}

export type ResultType = 'grant' | 'contract'

export interface ScoredProgram extends Program {
  id: string // universityName + directionId + educationType + language
  type: ResultType
  reserve: number
}

export interface MatchedResults {
  grant: ScoredProgram[]
  contract: ScoredProgram[]
}

export interface Filters {
  university: string
  region: string
  direction: string
  educationType: string
  language: string
  type: 'all' | ResultType
  minReserve: number | null
  maxReserve: number | null
}

export const EMPTY_FILTERS: Filters = {
  university: '',
  region: '',
  direction: '',
  educationType: '',
  language: '',
  type: 'all',
  minReserve: null,
  maxReserve: null,
}

export interface YearConfig {
  year: number
  label: string
  file: string
}

// Filters for the "Fanlar majmuasi" catalog page — browsing by subject pair
// without a user score, so there's no reserve/type-classification to filter
// by; instead "offering" filters on whether a program has a grant and/or
// contract slot at all.
export interface CatalogFilters {
  university: string
  region: string
  educationType: string
  language: string
  offering: 'all' | 'grant' | 'contract'
}

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  university: '',
  region: '',
  educationType: '',
  language: '',
  offering: 'all',
}

export type SortDirection = 'asc' | 'desc'

// Sort for the catalog page: a single list holds both grant and contract
// data per program, so all four fields are selectable directly.
export type CatalogSortField = 'grantScore' | 'contractScore' | 'grantQuota' | 'contractQuota'

export interface CatalogSort {
  field: CatalogSortField
  direction: SortDirection
}

export const DEFAULT_CATALOG_SORT: CatalogSort = { field: 'grantQuota', direction: 'desc' }

// Sort for the results page: grant and contract lists are already split,
// so each list only needs to choose between its own score / quota, or
// fall back to the existing reserve-based default ordering.
export type ResultSortField = 'default' | 'score' | 'quota'

export interface ResultSort {
  field: ResultSortField
  direction: SortDirection
}

export const DEFAULT_RESULT_SORT: ResultSort = { field: 'default', direction: 'desc' }