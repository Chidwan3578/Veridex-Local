import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { JobDetailView } from "@/components/job-detail-view"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSession()
  if (!user) redirect("/login")

  const job = db.job.findById(id)
  if (!job || job.recruiterId !== user.id) notFound()

  const matches = db.matchResult.findByJobId(job.id)
  const matchesWithNames = matches.map((m) => {
    const candidateUser = db.user.findById(m.candidateId)
    const profile = db.candidateProfile.findByUserId(m.candidateId)
    return {
      id: m.id,
      candidateId: m.candidateId,
      candidateName: candidateUser?.name ?? "Unknown",
      fitScore: m.fitScore,
      riskLevel: m.riskLevel,
      gapSummary: m.gapSummary,
      cgpa: profile?.cgpa ?? 0,
    }
  }).sort((a, b) => b.fitScore - a.fitScore)

  return (
    <JobDetailView
      job={{
        id: job.id,
        title: job.title,
        description: job.description,
        backendWeight: job.backendWeight,
        consistencyWeight: job.consistencyWeight,
        collaborationWeight: job.collaborationWeight,
        recencyWeight: job.recencyWeight,
        impactWeight: job.impactWeight,
        cgpaWeight: job.cgpaWeight,
        minThreshold: job.minThreshold,
        createdAt: job.createdAt.toISOString(),
      }}
      matches={matchesWithNames}
    />
  )
}
