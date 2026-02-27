import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateSkillScore } from "@/lib/scoring"
import { assessRisk } from "@/lib/risk"
import { CandidateImprovementView } from "@/components/candidate-improvement-view"

export default async function CandidateImprovementPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const profile = db.candidateProfile.findByUserId(user.id)
  const skills = db.skill.findByCandidateId(user.id)

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Complete your profile to see improvement suggestions.
      </div>
    )
  }

  const scoredSkills = skills.map((skill) => {
    const breakdown = calculateSkillScore(skill, profile.cgpa, profile.lastActiveDate)
    return {
      name: skill.name,
      score: skill.score,
      breakdown,
    }
  })

  const riskAssessment = assessRisk(profile, skills)

  return (
    <CandidateImprovementView
      skills={scoredSkills}
      riskAssessment={{
        level: riskAssessment.level,
        factors: riskAssessment.factors,
        score: riskAssessment.score,
      }}
      cgpa={profile.cgpa}
      overallScore={profile.overallScore}
    />
  )
}
