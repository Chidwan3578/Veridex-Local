// Risk Assessment Engine

import type { Skill, CandidateProfile } from "./db"

export type RiskLevel = "Low" | "Medium" | "High"

export interface RiskAssessment {
  level: RiskLevel
  factors: string[]
  score: number
}

export function assessRisk(
  profile: CandidateProfile,
  skills: Skill[]
): RiskAssessment {
  const factors: string[] = []
  let riskScore = 0

  // Check inactivity
  const now = new Date()
  const lastActive = new Date(profile.lastActiveDate)
  const monthsInactive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24 * 30)
  if (monthsInactive > 6) {
    factors.push("Inactive for over 6 months")
    riskScore += 25
  } else if (monthsInactive > 3) {
    factors.push("Reduced activity in past 3 months")
    riskScore += 10
  }

  // Check for contribution spikes (high variance in scores)
  if (skills.length > 0) {
    const scores = skills.map((s) => s.score)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length
    if (variance > 300) {
      factors.push("High variance in skill scores (potential spikes)")
      riskScore += 20
    }
  }

  // Check low collaboration
  if (skills.length > 0) {
    const avgCollab = skills.reduce((sum, s) => sum + s.collaborationScore, 0) / skills.length
    if (avgCollab < 50) {
      factors.push("Low collaboration metrics")
      riskScore += 20
    }
  }

  // Check extremely low CGPA
  if (profile.cgpa < 2.0) {
    factors.push("Extremely low CGPA")
    riskScore += 25
  } else if (profile.cgpa < 2.5) {
    factors.push("Below average CGPA")
    riskScore += 10
  }

  // Check single skill dominance
  if (skills.length > 1) {
    const sorted = [...skills].sort((a, b) => b.score - a.score)
    const topScore = sorted[0].score
    const secondScore = sorted[1].score
    if (topScore - secondScore > 30) {
      factors.push("Single skill dominance detected")
      riskScore += 15
    }
  }

  // Low data completeness
  if (profile.dataCompleteness < 60) {
    factors.push("Low data completeness")
    riskScore += 15
  }

  let level: RiskLevel = "Low"
  if (riskScore >= 50) level = "High"
  else if (riskScore >= 25) level = "Medium"

  return { level, factors, score: riskScore }
}
