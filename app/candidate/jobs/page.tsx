import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateFitScore } from "@/lib/matching"
import { CandidateJobsList, JobRecommendation } from "@/components/candidate-jobs-list"

export default async function CandidateJobsPage() {
    const user = await getSession()
    if (!user || user.role !== "candidate") redirect("/login")

    const profile = db.candidateProfile.findByUserId(user.id)
    const skills = db.skill.findByCandidateId(user.id)

    if (!profile) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground p-8 text-center border-2 border-dashed rounded-xl">
                Complete your profile to see personalized job recommendations.
            </div>
        )
    }

    const allJobs = db.job.findAll()

    const recommendations: JobRecommendation[] = allJobs.map((job) => {
        // 1. CGPA Check
        let cgpaStatus: "PASS" | "FAIL" = "PASS"
        if (job.cgpaThreshold !== null && job.cgpaCondition !== null) {
            if (job.cgpaCondition === "above" && profile.cgpa < job.cgpaThreshold) {
                cgpaStatus = "FAIL"
            } else if (job.cgpaCondition === "below" && profile.cgpa > job.cgpaThreshold) {
                cgpaStatus = "FAIL"
            }
        }

        // 2. Compute Match Score
        const matchPercentage = calculateFitScore(skills, profile, job)

        // 3. Suitability Label
        let suitability: JobRecommendation["suitability"] = "Low Match"
        if (matchPercentage >= 80) suitability = "Highly Suitable"
        else if (matchPercentage >= 60) suitability = "Good Match"
        else if (matchPercentage >= 40) suitability = "Moderate Match"

        // 4. Top Priorities
        const priorities = [
            { name: "Backend Depth", weight: job.backendWeight },
            { name: "Consistency", weight: job.consistencyWeight },
            { name: "Collaboration", weight: job.collaborationWeight },
            { name: "Recency", weight: job.recencyWeight },
            { name: "Impact", weight: job.impactWeight },
        ]

        const topPriorities = priorities
            .filter((p) => p.weight === "critical" || p.weight === "important")
            .map((p) => p.name)

        // 5. Skill Gaps
        const skillGaps: string[] = []

        // Average scores for each dimension
        const avgScore = (dim: "complexityScore" | "consistencyScore" | "collaborationScore" | "recencyScore" | "impactScore") =>
            skills.length > 0 ? skills.reduce((s, sk) => s + sk[dim], 0) / skills.length : 0

        const dimensions = [
            { name: "Backend depth", key: "complexityScore", weight: job.backendWeight },
            { name: "Consistency pattern", key: "consistencyScore", weight: job.consistencyWeight },
            { name: "Collaboration record", key: "collaborationScore", weight: job.collaborationWeight },
            { name: "Activity recency", key: "recencyScore", weight: job.recencyWeight },
            { name: "Contribution impact", key: "impactScore", weight: job.impactWeight },
        ]

        dimensions.forEach((d) => {
            const score = avgScore(d.key as any)
            if (score < 60 && d.weight === "critical") {
                skillGaps.push(`${d.name} needs improvement`)
            }
        })

        return {
            id: job.id,
            title: job.title,
            description: job.description,
            matchPercentage,
            suitability,
            cgpaStatus,
            cgpaRequirement: `${job.cgpaCondition === "above" ? ">" : "<"} ${job.cgpaThreshold}`,
            topPriorities,
            skillGaps,
            isBestMatch: false, // Will calculate this after mapping
        }
    })

    // Sort and identify Best Match
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage)
    if (recommendations.length > 0) {
        recommendations[0].isBestMatch = true
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground">Jobs For You</h1>
                <p className="text-muted-foreground">Discover opportunities aligned with your technical credibility</p>
            </div>

            <CandidateJobsList jobs={recommendations} />
        </div>
    )
}
