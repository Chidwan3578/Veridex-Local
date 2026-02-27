import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CandidateProfileView } from "@/components/candidate-profile-view"

export default async function CandidateProfilePage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const profile = db.candidateProfile.findByUserId(user.id)
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
        lastActiveDate: profile.lastActiveDate.toISOString(),
      } : null}
      skillCount={skills.length}
    />
  )
}
