import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { normalizeCGPA } from "@/lib/scoring"
import { assessRisk } from "@/lib/risk"
import { MatchSimulator } from "@/components/match-simulator"

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSession()
  if (!user) redirect("/login")

  const job = db.job.findById(id)
  if (!job || job.recruiterId !== user.id) notFound()

  // Prepare all candidate data for client-side simulation
  const allProfiles = db.candidateProfile.findAll()
  const allUsers = db.user.findAll().filter((u) => u.role === "candidate")

  const candidateData = allProfiles.map((profile) => {
    const candidateUser = allUsers.find((u) => u.id === profile.userId)
    if (!candidateUser) return null
    const skills = db.skill.findByCandidateId(profile.userId)
    const risk = assessRisk(profile, skills)

    const avgComplexity = skills.length > 0 ? skills.reduce((s, sk) => s + sk.complexityScore, 0) / skills.length : 0
    const avgConsistency = skills.length > 0 ? skills.reduce((s, sk) => s + sk.consistencyScore, 0) / skills.length : 0
    const avgCollaboration = skills.length > 0 ? skills.reduce((s, sk) => s + sk.collaborationScore, 0) / skills.length : 0
    const avgRecency = skills.length > 0 ? skills.reduce((s, sk) => s + sk.recencyScore, 0) / skills.length : 0
    const avgImpact = skills.length > 0 ? skills.reduce((s, sk) => s + sk.impactScore, 0) / skills.length : 0

    return {
      candidateId: candidateUser.id,
      candidateName: candidateUser.name,
      riskLevel: risk.level,
      gapSummary: `Overall: complexity ${avgComplexity.toFixed(0)}, consistency ${avgConsistency.toFixed(0)}, collaboration ${avgCollaboration.toFixed(0)}, recency ${avgRecency.toFixed(0)}, impact ${avgImpact.toFixed(0)}, CGPA ${normalizeCGPA(profile.cgpa).toFixed(0)}/100`,
      cgpa: profile.cgpa,
      skillBreakdown: {
        complexity: avgComplexity,
        consistency: avgConsistency,
        collaboration: avgCollaboration,
        recency: avgRecency,
        impact: avgImpact,
        cgpa: normalizeCGPA(profile.cgpa),
      },
    }
  }).filter(Boolean) as Array<{
    candidateId: string
    candidateName: string
    riskLevel: string
    gapSummary: string
    cgpa: number
    skillBreakdown: Record<string, number>
  }>

  return (
    <MatchSimulator
      jobTitle={job.title}
      jobId={job.id}
      initialWeights={{
        backendWeight: job.backendWeight,
        consistencyWeight: job.consistencyWeight,
        collaborationWeight: job.collaborationWeight,
        recencyWeight: job.recencyWeight,
        impactWeight: job.impactWeight,
        cgpaWeight: job.cgpaWeight,
      }}
      initialThreshold={job.minThreshold}
      candidates={candidateData}
    />
  )
}
