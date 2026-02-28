import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { HomepageNav } from "@/components/homepage/homepage-nav"
import { HeroSection } from "@/components/homepage/hero-section"
import { StatsSection } from "@/components/homepage/stats-section"
import { FeaturesSection } from "@/components/homepage/features-section"
import { RolesSection } from "@/components/homepage/roles-section"
import { FooterSection } from "@/components/homepage/footer-section"


export default async function HomePage() {
  const user = await getSession()

  // If already logged in, redirect to their dashboard
  if (user) {
    if (user.role === "recruiter") {
      redirect("/recruiter/dashboard")
    }
    redirect("/candidate/profile")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HomepageNav />
      <main className="flex-1">
        <HeroSection />

        <StatsSection />
        <FeaturesSection />
        <RolesSection />
      </main>
      <FooterSection />
    </div>
  )
}
