import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function HomePage() {
  const user = await getSession()
  if (!user) {
    redirect("/login")
  }
  if (user.role === "recruiter") {
    redirect("/recruiter/dashboard")
  }
  redirect("/candidate/profile")
}
