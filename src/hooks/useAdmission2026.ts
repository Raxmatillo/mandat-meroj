import { useEffect, useState } from 'react'
import { adapt2026, type NormalizedProgram } from '../adapters/data2026Adapter'

const DATA_FILE = '/data/e8k2n91.json'

export function useAdmission2026(enabled = true) {
  const [programs, setPrograms] = useState<NormalizedProgram[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setPrograms([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetch(DATA_FILE, { signal: controller.signal, cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('load')
        return response.json() as Promise<unknown>
      })
      .then((raw) => {
        const rows = adapt2026(raw)
        if (!rows.length) throw new Error('empty')
        setPrograms(rows)
      })
      .catch(() => {
        if (!controller.signal.aborted) setError('Ma’lumotlarni yuklashda xatolik yuz berdi.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [enabled])

  return { programs, loading, error }
}
