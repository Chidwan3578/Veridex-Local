import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { RecruiterSidebar } from "@/components/recruiter-sidebar"

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()
  if (!user) redirect("/login")
  if (user.role !== "recruiter") redirect("/candidate/profile")

  const jobs = db.job.findByRecruiterId(user.id)

  return (
    <div className="min-h-screen bg-background">
      <RecruiterSidebar jobs={jobs.map((j) => ({ id: j.id, title: j.title }))} />
      <main className="pt-14 lg:ml-64 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
