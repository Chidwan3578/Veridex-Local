"use server"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { matchCandidates } from "@/lib/matching"
import { assessRisk } from "@/lib/risk"

export async function createJobAction(formData: FormData) {
  const user = await getSession()
  if (!user || user.role !== "recruiter") redirect("/login")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const backendWeight = parseFloat(formData.get("backendWeight") as string) || 0.25
  const consistencyWeight = parseFloat(formData.get("consistencyWeight") as string) || 0.20
  const collaborationWeight = parseFloat(formData.get("collaborationWeight") as string) || 0.15
  const recencyWeight = parseFloat(formData.get("recencyWeight") as string) || 0.15
  const impactWeight = parseFloat(formData.get("impactWeight") as string) || 0.15
  const cgpaWeight = parseFloat(formData.get("cgpaWeight") as string) || 0.10
  const minThreshold = parseFloat(formData.get("minThreshold") as string) || 50

  if (!title || !description) {
    return { error: "Title and description are required" }
  }

  const job = db.job.create({
    recruiterId: user.id,
    title,
    description,
    backendWeight,
    consistencyWeight,
    collaborationWeight,
    recencyWeight,
    impactWeight,
    cgpaWeight,
    minThreshold,
  })

  // Auto-run matching
  const allProfiles = db.candidateProfile.findAll()
  const allUsers = db.user.findAll().filter((u) => u.role === "candidate")
  
  const candidates = allProfiles.map((profile) => {
    const candidateUser = allUsers.find((u) => u.id === profile.userId)
    const skills = db.skill.findByCandidateId(profile.userId)
    const risk = assessRisk(profile, skills)
    return {
      user: { id: profile.userId, name: candidateUser?.name ?? "Unknown" },
      profile,
      skills,
      riskLevel: risk.level,
    }
  }).filter((c) => c.user)

  const matches = matchCandidates(job, candidates)

  matches.forEach((match) => {
    db.matchResult.create({
      jobId: job.id,
      candidateId: match.candidateId,
      fitScore: match.fitScore,
      riskLevel: match.riskLevel,
      gapSummary: match.gapSummary,
    })
  })

  redirect(`/recruiter/job/${job.id}`)
}
