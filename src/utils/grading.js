export function getLetterGrade(score) {
  const numericScore = Number(score)

  if (numericScore >= 70) return 'A'
  if (numericScore >= 60) return 'B'
  if (numericScore >= 50) return 'C'
  if (numericScore >= 45) return 'D'
  if (numericScore >= 40) return 'E'
  return 'F'
}
