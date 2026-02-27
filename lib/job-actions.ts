"use server"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { matchCandidates } from "@/lib/matching"
import { assessRisk } from "@/lib/risk"

import { fetchGitHubData } from "./github"

export async function createJobAction(formData: FormData) {
  const user = await getSession()
  if (!user || user.role !== "recruiter") redirect("/login")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const backendWeight = formData.get("backendWeight") as string
  const consistencyWeight = formData.get("consistencyWeight") as string
  const collaborationWeight = formData.get("collaborationWeight") as string
  const recencyWeight = formData.get("recencyWeight") as string
  const impactWeight = formData.get("impactWeight") as string
  const cgpaWeight = 0 // CGPA weight is removed
  const minThreshold = parseFloat(formData.get("minThreshold") as string) || 50

  const cgpaThreshold = formData.get("cgpaThreshold") ? parseFloat(formData.get("cgpaThreshold") as string) : null
  const cgpaCondition = formData.get("cgpaCondition") as "above" | "below" | null

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
    cgpaThreshold,
    cgpaCondition,
  })

  // Auto-run matching
  const allProfiles = db.candidateProfile.findAll()
  const allUsers = db.user.findAll().filter((u) => u.role === "candidate")

  const candidates = await Promise.all(allProfiles.map(async (profile) => {
    const candidateUser = allUsers.find((u) => u.id === profile.userId)
    const skills = db.skill.findByCandidateId(profile.userId)

    // Fetch GitHub data for risk assessment if username exists
    const githubData = profile.githubUsername ? await fetchGitHubData(profile.githubUsername) : null
    const risk = assessRisk(profile, skills, githubData)

    return {
      user: { id: profile.userId, name: candidateUser?.name ?? "Unknown" },
      profile,
      skills,
      riskLevel: risk.level,
    }
  }))

  const filteredCandidates = candidates.filter((c) => c.user)
  const matches = matchCandidates(job, filteredCandidates)

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
