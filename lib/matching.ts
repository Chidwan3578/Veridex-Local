// Job Matching Engine

import type { Job, Skill, CandidateProfile } from "./db"
import { normalizeCGPA } from "./scoring"

export interface CandidateMatch {
  candidateId: string
  candidateName: string
  fitScore: number
  riskLevel: string
  gapSummary: string
  skillBreakdown: Record<string, number>
}

function getAverageSkillDimension(
  skills: Skill[],
  dimension: keyof Pick<Skill, "complexityScore" | "consistencyScore" | "collaborationScore" | "recencyScore" | "impactScore">
): number {
  if (skills.length === 0) return 0
  return skills.reduce((sum, s) => sum + s[dimension], 0) / skills.length
}

function generateGapSummary(
  skills: Skill[],
  profile: CandidateProfile,
  job: Job
): string {
  const gaps: string[] = []
  const strengths: string[] = []

  const avgComplexity = getAverageSkillDimension(skills, "complexityScore")
  const avgConsistency = getAverageSkillDimension(skills, "consistencyScore")
  const avgCollaboration = getAverageSkillDimension(skills, "collaborationScore")
  const avgRecency = getAverageSkillDimension(skills, "recencyScore")
  const avgImpact = getAverageSkillDimension(skills, "impactScore")

  if (avgComplexity > 80) strengths.push("strong technical complexity")
  else if (avgComplexity < 60) gaps.push("technical complexity could be improved")

  if (avgConsistency > 80) strengths.push("consistent contributor")
  else if (avgConsistency < 60) gaps.push("inconsistent contribution pattern")

  if (avgCollaboration > 80) strengths.push("excellent collaborator")
  else if (avgCollaboration < 60) gaps.push("collaboration skills need development")

  if (avgRecency > 80) strengths.push("recently active")
  else if (avgRecency < 60) gaps.push("declining recent activity")

  if (avgImpact > 80) strengths.push("high-impact contributions")
  else if (avgImpact < 60) gaps.push("impact could be stronger")

  const normalizedCGPA = normalizeCGPA(profile.cgpa)
  if (normalizedCGPA > 85) strengths.push("strong academic record")
  else if (normalizedCGPA < 65) gaps.push("academic performance below threshold")

  const summary: string[] = []
  if (strengths.length > 0) summary.push(`Strengths: ${strengths.join(", ")}.`)
  if (gaps.length > 0) summary.push(`Gaps: ${gaps.join(", ")}.`)

  return summary.join(" ") || "Balanced profile with no significant gaps."
}

export function calculateFitScore(
  skills: Skill[],
  profile: CandidateProfile,
  job: Job
): number {
  const avgComplexity = getAverageSkillDimension(skills, "complexityScore")
  const avgConsistency = getAverageSkillDimension(skills, "consistencyScore")
  const avgCollaboration = getAverageSkillDimension(skills, "collaborationScore")
  const avgRecency = getAverageSkillDimension(skills, "recencyScore")
  const avgImpact = getAverageSkillDimension(skills, "impactScore")
  const normalizedCGPA = normalizeCGPA(profile.cgpa)

  const fitScore =
    job.backendWeight * avgComplexity +
    job.consistencyWeight * avgConsistency +
    job.collaborationWeight * avgCollaboration +
    job.recencyWeight * avgRecency +
    job.impactWeight * avgImpact +
    job.cgpaWeight * normalizedCGPA

  return Math.round(fitScore * 100) / 100
}

export function matchCandidates(
  job: Job,
  candidates: Array<{
    user: { id: string; name: string }
    profile: CandidateProfile
    skills: Skill[]
    riskLevel: string
  }>
): CandidateMatch[] {
  const matches: CandidateMatch[] = candidates
    .map((c) => {
      const fitScore = calculateFitScore(c.skills, c.profile, job)
      const gapSummary = generateGapSummary(c.skills, c.profile, job)

      return {
        candidateId: c.user.id,
        candidateName: c.user.name,
        fitScore,
        riskLevel: c.riskLevel,
        gapSummary,
        skillBreakdown: {
          complexity: getAverageSkillDimension(c.skills, "complexityScore"),
          consistency: getAverageSkillDimension(c.skills, "consistencyScore"),
          collaboration: getAverageSkillDimension(c.skills, "collaborationScore"),
          recency: getAverageSkillDimension(c.skills, "recencyScore"),
          impact: getAverageSkillDimension(c.skills, "impactScore"),
          cgpa: normalizeCGPA(c.profile.cgpa),
        },
      }
    })
    .filter((m) => m.fitScore >= job.minThreshold)
    .sort((a, b) => b.fitScore - a.fitScore)

  return matches
}

// Client-side weight simulation function
export function simulateRanking(
  candidates: Array<{
    candidateId: string
    candidateName: string
    riskLevel: string
    gapSummary: string
    skillBreakdown: Record<string, number>
  }>,
  weights: {
    backendWeight: number
    consistencyWeight: number
    collaborationWeight: number
    recencyWeight: number
    impactWeight: number
    cgpaWeight: number
  },
  minThreshold: number
): CandidateMatch[] {
  return candidates
    .map((c) => {
      const fitScore =
        weights.backendWeight * (c.skillBreakdown.complexity || 0) +
        weights.consistencyWeight * (c.skillBreakdown.consistency || 0) +
        weights.collaborationWeight * (c.skillBreakdown.collaboration || 0) +
        weights.recencyWeight * (c.skillBreakdown.recency || 0) +
        weights.impactWeight * (c.skillBreakdown.impact || 0) +
        weights.cgpaWeight * (c.skillBreakdown.cgpa || 0)

      return {
        ...c,
        fitScore: Math.round(fitScore * 100) / 100,
      }
    })
    .filter((m) => m.fitScore >= minThreshold)
    .sort((a, b) => b.fitScore - a.fitScore)
}
