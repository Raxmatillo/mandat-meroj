export function calculateReserve(userScore: number, passingScore: number): number {
  return Math.round((userScore - passingScore) * 10) / 10
}

export function reserveLevel(reserve: number): 'high' | 'medium' | 'low' {
  if (reserve >= 15) return 'high'
  if (reserve >= 5) return 'medium'
  return 'low'
}
