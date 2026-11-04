import type { Program } from '../types'
import { getYearConfig } from '../data/yearConfig'
import { adapt2025 } from '../adapters/data2025Adapter'
import { adapt2024 } from '../adapters/data2024Adapter'
import { adapt2023 } from '../adapters/data2023Adapter'

// Registry mapping year -> adapter function. This is the one place that
// needs a new line when a new year's adapter is added.
const ADAPTERS: Record<number, (raw: unknown) => Program[]> = {
  2025: (raw) => adapt2025(raw as never),
  2024: (raw) => adapt2024(raw as never),
  2023: (raw) => adapt2023(raw as never),
}

export class DataLoadError extends Error {}

export async function loadYearData(year: number): Promise<Program[]> {
  const config = getYearConfig(year)
  const adapter = ADAPTERS[year]

  if (!adapter) {
    throw new DataLoadError(`${year}-yil uchun adapter topilmadi`)
  }

  let response: Response
  try {
    response = await fetch(config.file)
  } catch {
    throw new DataLoadError(`${config.label} ma'lumotlarini yuklashda xatolik yuz berdi.`)
  }

  if (!response.ok) {
    throw new DataLoadError(`${config.label} ma'lumotlarini yuklashda xatolik yuz berdi.`)
  }

  let raw: unknown
  try {
    raw = await response.json()
  } catch {
    throw new DataLoadError(`${config.label} ma'lumotlarini o'qishda xatolik yuz berdi.`)
  }

  return adapter(raw)
}

export function getUniqueSubjects(programs: Program[]): string[] {
  const set = new Set<string>()
  for (const p of programs) {
    for (const s of p.subjects) {
      if (s) set.add(s)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'uz'))
}

export function getUniqueRegions(programs: Program[]): string[] {
  const set = new Set<string>()
  for (const p of programs) {
    if (p.region) set.add(p.region)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'uz'))
}

export function getUniqueEducationTypes(programs: Program[]): string[] {
  const set = new Set<string>()
  for (const p of programs) {
    if (p.educationType) set.add(p.educationType)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'uz'))
}
