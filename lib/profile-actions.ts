"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateOverallScore } from "@/lib/scoring"
import { fetchLinkedInCertifications } from "@/lib/linkedin"


export async function updateProfileAction(formData: FormData) {
    const user = await getSession()
    if (!user || user.role !== "candidate") {
        return { error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const cgpa = parseFloat(formData.get("cgpa") as string)
    const githubUsername = formData.get("githubUsername") as string
    const leetcodeUsername = formData.get("leetcodeUsername") as string
    const leetcodeScore = parseFloat(formData.get("leetcodeScore") as string) || 0
    const leetcodeRank = parseInt(formData.get("leetcodeRank") as string) || 0
    const linkedinUrl = formData.get("linkedinUrl") as string

    if (!name || isNaN(cgpa)) {
        return { error: "Name and valid CGPA are required" }
    }

    if (cgpa < 0 || cgpa > 10) {
        return { error: "CGPA must be between 0 and 10" }
    }

    try {
        // Update user name
        db.user.update(user.id, { name })

        // 1. Fetch LinkedIn Certifications automatically
        const certList = await fetchLinkedInCertifications(linkedinUrl)
        const linkedinCertifications = certList.join(", ")
        const linkedinCertificationsCount = certList.length

        // Fetch skills to calculate overall score
        const skills = db.skill.findByCandidateId(user.id)
        const lastActiveDate = new Date()
        const overallScore = calculateOverallScore(skills, cgpa, lastActiveDate, leetcodeScore, linkedinCertifications)

        // Update candidate profile
        const existingProfile = db.candidateProfile.findByUserId(user.id)
        db.candidateProfile.upsertByUserId(user.id, {
            cgpa,
            githubUsername,
            leetcodeUsername,
            leetcodeScore,
            leetcodeRank,
            linkedinUrl,
            linkedinCertificationsCount,
            linkedinCertifications,
            overallScore,
            riskScore: "Low",
            dataCompleteness: 100,
            lastActiveDate,
            resumeText: existingProfile?.resumeText || null,
        })

        revalidatePath("/candidate/dashboard")
        revalidatePath("/candidate/profile")
        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { error: "Failed to update profile" }
    }
}

export async function updateResumeAction(resumeText: string) {
    const user = await getSession()
    if (!user || user.role !== "candidate") throw new Error("Unauthorized")

    const existingProfile = db.candidateProfile.findByUserId(user.id)

    db.candidateProfile.upsertByUserId(user.id, {
        githubUsername: existingProfile?.githubUsername || "",
        cgpa: existingProfile?.cgpa || 0,
        leetcodeUsername: existingProfile?.leetcodeUsername || null,
        leetcodeScore: existingProfile?.leetcodeScore || 0,
        leetcodeRank: existingProfile?.leetcodeRank || 0,
        linkedinUrl: existingProfile?.linkedinUrl || null,
        linkedinCertificationsCount: existingProfile?.linkedinCertificationsCount || 0,
        linkedinCertifications: existingProfile?.linkedinCertifications || null,
        overallScore: existingProfile?.overallScore || 0,
        riskScore: existingProfile?.riskScore || "Low",
        dataCompleteness: existingProfile?.dataCompleteness || 0,
        lastActiveDate: existingProfile?.lastActiveDate || new Date(),
        resumeText,
    })

    revalidatePath("/candidate/resume")
    revalidatePath("/candidate/profile")
    return { success: true }
}
