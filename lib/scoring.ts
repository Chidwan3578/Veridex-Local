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
  leetcodeContribution: number
  linkedinContribution: number
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

function calculateCertificationValue(certifications: string | null): number {
  if (!certifications) return 0

  const certs = certifications.toLowerCase()
  let score = 0

  // High value keywords
  if (certs.includes("architect")) score += 5
  if (certs.includes("specialty")) score += 5
  if (certs.includes("professional")) score += 4
  if (certs.includes("expert")) score += 4

  // Medium value keywords
  if (certs.includes("associate")) score += 3
  if (certs.includes("administrator")) score += 3
  if (certs.includes("developer")) score += 3
  if (certs.includes("cka")) score += 5 // Kubernetes is high value

  // Entry value keywords
  if (certs.includes("fundamentals")) score += 1
  if (certs.includes("basics")) score += 1

  // Count bonus (1 point per unique cert up to 5)
  const count = certifications.split(",").length
  score += Math.min(count, 5)

  return Math.min(score, 25) // Cap at 25 points
}

export function calculateSkillScore(
  skill: Skill,
  cgpa: number,
  lastActiveDate: Date,
  leetcodeScore: number = 0,
  linkedinCertifications: string | null = null
): ScoreBreakdown {
  const normalizedCGPA = normalizeCGPA(cgpa)
  const decay = calculateDecayFactor(lastActiveDate)

  // LeetCode contribution: Max 10 points (normalized from score, assuming 3000 as a high bar)
  const leetcodeContribution = Math.min((leetcodeScore / 3000) * 10, 10)

  // LinkedIn contribution: Intelligent scoring based on cert names, max 10 points normalized
  const certValue = calculateCertificationValue(linkedinCertifications)
  const linkedinContribution = Math.min((certValue / 25) * 10, 10)

  // Adjusted weights to accommodate new metrics
  // Original total was 1.0 (20+15+15+15+15+10+10 = 100)
  // New weights:
  // complexity: 0.15, consistency: 0.10, collaboration: 0.10, recency: 0.10, impact: 0.15, 
  // certification: 0.10, cgpa: 0.10, leetcode: 0.10, linkedin: 0.10
  // Total: 0.15+0.10+0.10+0.10+0.15+0.10+0.10+0.10+0.10 = 1.0

  const rawScore =
    0.15 * skill.complexityScore +
    0.10 * skill.consistencyScore +
    0.10 * skill.collaborationScore +
    0.10 * skill.recencyScore +
    0.15 * skill.impactScore +
    0.10 * skill.certificationBonus +
    0.10 * normalizedCGPA +
    0.10 * (leetcodeContribution * 10) + // Scale to 100
    0.10 * (linkedinContribution * 10)   // Scale to 100

  const finalScore = Math.round(rawScore * decay * 100) / 100

  return {
    complexity: skill.complexityScore,
    consistency: skill.consistencyScore,
    collaboration: skill.collaborationScore,
    recency: skill.recencyScore,
    impact: skill.impactScore,
    certification: skill.certificationBonus,
    cgpaContribution: normalizedCGPA,
    leetcodeContribution: leetcodeContribution * 10,
    linkedinContribution: linkedinContribution * 10,
    decayApplied: decay < 1.0,
    rawScore: Math.round(rawScore * 100) / 100,
    finalScore,
  }
}

export function calculateOverallScore(
  skills: Skill[],
  cgpa: number,
  lastActiveDate: Date,
  leetcodeScore: number = 0,
  linkedinCertifications: string | null = null
): number {
  if (skills.length === 0) return 0
  const scores = skills.map((s) => calculateSkillScore(s, cgpa, lastActiveDate, leetcodeScore, linkedinCertifications))
  const avg = scores.reduce((sum, s) => sum + s.finalScore, 0) / scores.length
  return Math.round(avg * 100) / 100
}
