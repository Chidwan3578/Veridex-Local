import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { RecruiterDashboardView } from "@/components/recruiter-dashboard-view"

export default async function RecruiterDashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const jobs = db.job.findByRecruiterId(user.id)
  const allCandidates = db.candidateProfile.findAll()

  const jobsWithCounts = jobs.map((job) => {
    const matches = db.matchResult.findByJobId(job.id)
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      matchCount: matches.length,
      topScore: matches.length > 0 ? Math.max(...matches.map((m) => m.fitScore)) : 0,
      createdAt: job.createdAt.toISOString(),
    }
  })

  return (
    <RecruiterDashboardView
      recruiterName={user.name}
      jobs={jobsWithCounts}
      totalCandidates={allCandidates.length}
    />
  )
}
