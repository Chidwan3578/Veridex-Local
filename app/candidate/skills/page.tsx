import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CandidateSkillsView } from "@/components/candidate-skills-view"

export default async function CandidateSkillsPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const skills = db.skill.findByCandidateId(user.id)
  const profile = db.candidateProfile.findByUserId(user.id)

  const skillsWithHistory = skills.map((skill) => {
    const history = db.skillHistory.findBySkillId(skill.id)
    return {
      id: skill.id,
      name: skill.name,
      score: skill.score,
      complexityScore: skill.complexityScore,
      consistencyScore: skill.consistencyScore,
      collaborationScore: skill.collaborationScore,
      recencyScore: skill.recencyScore,
      impactScore: skill.impactScore,
      certificationBonus: skill.certificationBonus,
      history: history.map((h) => ({ month: h.month, score: h.score })),
    }
  })

  return (
    <CandidateSkillsView
      skills={skillsWithHistory}
      cgpa={profile?.cgpa ?? 0}
    />
  )
}
