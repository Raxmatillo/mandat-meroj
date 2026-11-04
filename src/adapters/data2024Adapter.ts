import type { Program } from '../types'
import { toStr, toNum, splitSubjects, slugify } from '../utils/normalize'

// Raw shape of public/data/data2024.json — universities with nested directions.
interface Raw2024Direction {
  e?: string
  f?: string
  g?: number | string
  k?: number | string
  l?: string
  n?: string
  s?: string
  gq?: number | string
  kq?: number | string
}

interface Raw2024University {
  name?: string
  region?: string
  directions?: Raw2024Direction[]
}

interface Raw2024Root {
  data?: Raw2024University[]
}

export function adapt2024(root: Raw2024Root): Program[] {
  const universities = Array.isArray(root?.data) ? root.data : []

  return universities.flatMap((uni) => {
    const universityName = toStr(uni.name)
    const universitySlug = slugify(universityName)
    const region = toStr(uni.region)
    const directions = Array.isArray(uni.directions) ? uni.directions : []

    return directions.map((dir) => ({
      universityName,
      universitySlug,
      region,
      directionId: toStr(dir.s),
      directionName: toStr(dir.n),
      educationType: toStr(dir.e),
      language: toStr(dir.l),
      subjects: splitSubjects(dir.f),
      grantScore: toNum(dir.g),
      contractScore: toNum(dir.k),
      grantQuota: toNum(dir.gq),
      contractQuota: toNum(dir.kq),
      year: 2024,
    }))
  })
}
