import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { CandidateSidebar } from "@/components/candidate-sidebar"

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()
  if (!user) redirect("/login")
  if (user.role !== "candidate") redirect("/recruiter/dashboard")

  return (
    <div className="min-h-screen bg-background">
      <CandidateSidebar />
      <main className="pt-14 lg:ml-64 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
