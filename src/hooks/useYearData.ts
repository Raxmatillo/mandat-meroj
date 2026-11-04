import { useEffect, useState } from 'react'
import type { Program } from '../types'
import {
  loadYearData,
  getUniqueSubjects,
  getUniqueRegions,
  getUniqueEducationTypes,
  DataLoadError,
} from '../services/dataLoader'

interface UseYearDataResult {
  programs: Program[]
  subjects: string[]
  regions: string[]
  educationTypes: string[]
  loading: boolean
  error: string | null
}

export function useYearData(year: number, enabled = true): UseYearDataResult {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setPrograms([])
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    loadYearData(year)
      .then((data) => {
        if (cancelled) return
        setPrograms(data)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        const message =
          err instanceof DataLoadError ? err.message : `${year}-yil ma'lumotlarini yuklashda xatolik yuz berdi.`
        setError(message)
        setPrograms([])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [year, enabled])

  return {
    programs,
    subjects: getUniqueSubjects(programs),
    regions: getUniqueRegions(programs),
    educationTypes: getUniqueEducationTypes(programs),
    loading,
    error,
  }
}
