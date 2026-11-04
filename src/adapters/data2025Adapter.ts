import type { Program } from '../types'
import { toStr, toNum, toSubjects, slugify } from '../utils/normalize'

// Raw shape of public/data/data2025.json — a flat array of rows.
interface Raw2025Row {
  OTM?: string
  dirid?: string
  dirnm?: string
  emnm?: string
  langnm?: string
  ballgr?: string | number
  ballk?: string | number
  grantnm?: string | number
  contractnm?: string | number
  fan_1?: string
  fan_2?: string
  oliygohSlug?: string
  viloyatLabel?: string
}

export function adapt2025(rows: Raw2025Row[]): Program[] {
  if (!Array.isArray(rows)) return []

  return rows.map((row) => {
    const universityName = toStr(row.OTM)
    return {
      universityName,
      universitySlug: toStr(row.oliygohSlug) || slugify(universityName),
      region: toStr(row.viloyatLabel),
      directionId: toStr(row.dirid),
      directionName: toStr(row.dirnm),
      educationType: toStr(row.emnm),
      language: toStr(row.langnm),
      subjects: toSubjects(row.fan_1, row.fan_2),
      grantScore: toNum(row.ballgr),
      contractScore: toNum(row.ballk),
      grantQuota: toNum(row.grantnm),
      contractQuota: toNum(row.contractnm),
      year: 2025,
    }
  })
}
