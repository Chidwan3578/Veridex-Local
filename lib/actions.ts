"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = db.user.findByEmail(email)
  if (!user || user.password !== password) {
    return { error: "Invalid email or password" }
  }

  const token = createSessionToken(user.id)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  if (user.role === "recruiter") {
    redirect("/recruiter/dashboard")
  } else {
    redirect("/candidate/profile")
  }
}

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as "candidate" | "recruiter"

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" }
  }

  const existing = db.user.findByEmail(email)
  if (existing) {
    return { error: "Email already registered" }
  }

  const user = db.user.create({ name, email, password, role, image: null })

  if (role === "candidate") {
    db.candidateProfile.create({
      userId: user.id,
      githubUsername: "",
      cgpa: 0,
      overallScore: 0,
      riskScore: "Low",
      dataCompleteness: 10,
      lastActiveDate: new Date(),
    })
  }

  const token = createSessionToken(user.id)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  if (user.role === "recruiter") {
    redirect("/recruiter/dashboard")
  } else {
    redirect("/candidate/profile")
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}
