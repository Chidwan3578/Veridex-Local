"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function updateProfileAction(formData: FormData) {
    const user = await getSession()
    if (!user || user.role !== "candidate") {
        return { error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const cgpa = parseFloat(formData.get("cgpa") as string)
    const githubUsername = formData.get("githubUsername") as string

    if (!name || isNaN(cgpa)) {
        return { error: "Name and valid CGPA are required" }
    }

    if (cgpa < 0 || cgpa > 10) {
        return { error: "CGPA must be between 0 and 10" }
    }

    try {
        // Update user name
        db.user.update(user.id, { name })

        // Update candidate profile
        db.candidateProfile.upsertByUserId(user.id, {
            cgpa,
            githubUsername,
            // Keep other fields as they are (in-memory db upsert handles this)
            overallScore: 0, // In a real app, these would be recalculated
            riskScore: "Low",
            dataCompleteness: 100,
            lastActiveDate: new Date(),
        })

        revalidatePath("/candidate/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { error: "Failed to update profile" }
    }
}
