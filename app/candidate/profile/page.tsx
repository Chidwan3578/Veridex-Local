import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CandidateProfileView } from "@/components/candidate-profile-view"
import { fetchGitHubData } from "@/lib/github"

export default async function CandidateProfilePage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const profile = db.candidateProfile.findByUserId(user.id)
  const githubData = profile?.githubUsername ? await fetchGitHubData(profile.githubUsername) : null
  const skills = profile ? db.skill.findByCandidateId(user.id) : []

  return (
    <CandidateProfileView
      user={{ id: user.id, name: user.name, email: user.email, image: user.image }}
      profile={profile ? {
        githubUsername: profile.githubUsername,
        cgpa: profile.cgpa,
        overallScore: profile.overallScore,
        riskScore: profile.riskScore,
        dataCompleteness: profile.dataCompleteness,
        leetcodeUsername: profile.leetcodeUsername,
        leetcodeScore: profile.leetcodeScore,
        leetcodeRank: profile.leetcodeRank,
        linkedinUrl: profile.linkedinUrl,
        linkedinCertificationsCount: profile.linkedinCertificationsCount,
        linkedinCertifications: profile.linkedinCertifications,
        lastActiveDate: profile.lastActiveDate.toISOString(),
      } : null}
      skillCount={skills.length}
      githubData={githubData}
    />
  )
}
