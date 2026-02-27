import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CandidateResumeUI } from "@/components/candidate-resume-ui"

export default async function CandidateResumePage() {
    const user = await getSession()
    if (!user || user.role !== "candidate") redirect("/login")

    const profile = db.candidateProfile.findByUserId(user.id)
    const skills = db.skill.findByCandidateId(user.id)

    return (
        <CandidateResumeUI
            initialResume={profile?.resumeText || null}
            skills={skills.map(s => ({ name: s.name, score: s.score }))}
        />
    )
}
