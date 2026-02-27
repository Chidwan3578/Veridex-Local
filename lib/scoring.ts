// Skill Credibility Scoring Engine
// score = (0.20 * complexity) + (0.15 * consistency) + (0.15 * collaboration)
//       + (0.15 * recency) + (0.15 * impact) + (0.10 * certification) + (0.10 * normalizedCGPA)

import type { Skill, CandidateProfile } from "./db"

export interface ScoreBreakdown {
  complexity: number
  consistency: number
  collaboration: number
  recency: number
  impact: number
  certification: number
  cgpaContribution: number
  decayApplied: boolean
  rawScore: number
  finalScore: number
}

export function normalizeCGPA(cgpa: number, scale: number = 10.0): number {
  return (cgpa / scale) * 100
}

function calculateDecayFactor(lastActiveDate: Date): number {
  const now = new Date()
  const diffMs = now.getTime() - lastActiveDate.getTime()
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30)
  if (diffMonths <= 6) return 1.0
  if (diffMonths <= 12) return 0.85
  if (diffMonths <= 18) return 0.7
  return 0.5
}

export function calculateSkillScore(
  skill: Skill,
  cgpa: number,
  lastActiveDate: Date
): ScoreBreakdown {
  const normalizedCGPA = normalizeCGPA(cgpa)
  const decay = calculateDecayFactor(lastActiveDate)

  const rawScore =
    0.20 * skill.complexityScore +
    0.15 * skill.consistencyScore +
    0.15 * skill.collaborationScore +
    0.15 * skill.recencyScore +
    0.15 * skill.impactScore +
    0.10 * skill.certificationBonus +
    0.10 * normalizedCGPA

  const finalScore = Math.round(rawScore * decay * 100) / 100

  return {
    complexity: skill.complexityScore,
    consistency: skill.consistencyScore,
    collaboration: skill.collaborationScore,
    recency: skill.recencyScore,
    impact: skill.impactScore,
    certification: skill.certificationBonus,
    cgpaContribution: normalizedCGPA,
    decayApplied: decay < 1.0,
    rawScore: Math.round(rawScore * 100) / 100,
    finalScore,
  }
}

export function calculateOverallScore(
  skills: Skill[],
  cgpa: number,
  lastActiveDate: Date
): number {
  if (skills.length === 0) return 0
  const scores = skills.map((s) => calculateSkillScore(s, cgpa, lastActiveDate))
  const avg = scores.reduce((sum, s) => sum + s.finalScore, 0) / scores.length
  return Math.round(avg * 100) / 100
}
