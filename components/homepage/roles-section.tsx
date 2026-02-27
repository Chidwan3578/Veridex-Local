'use client'

import Link from "next/link"
import { ArrowRight, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

import dynamic from "next/dynamic"

const ShaderGradient = dynamic(
  () => import("@/components/ui/shader-gradient-wrapper").then((mod) => mod.ShaderGradientWrapper),
  { ssr: false }
)

export function RolesSection() {
  return (
    <section className="relative border-t border-border/50 px-6 py-24 overflow-hidden">
      <ShaderGradient />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Two Perspectives
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Built for candidates and recruiters alike
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Candidate Card */}
          <div className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-card/30 p-8 shadow-2xl backdrop-blur-2xl transition-all hover:bg-card/50 hover:border-primary/30 hover:scale-[1.01]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border border-white/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-foreground">
                For Candidates
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  View your credibility score breakdown across 7 factors
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Analyze skills with interactive radar charts and timelines
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Get personalized improvement suggestions to boost your profile
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Understand how decay and risk factors affect your ranking
                </li>
              </ul>
            </div>
            <Button asChild variant="outline" className="mt-auto w-fit gap-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10">
              <Link href="/signup">
                Join as Candidate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Recruiter Card */}
          <div className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-card/30 p-8 shadow-2xl backdrop-blur-2xl transition-all hover:bg-card/50 hover:border-accent/30 hover:scale-[1.01]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 backdrop-blur-md border border-white/10">
              <Briefcase className="h-6 w-6 text-accent" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-foreground">
                For Recruiters
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Create jobs with configurable skill weight requirements
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  See ranked candidate lists with fit scores and risk badges
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Use the weight simulator to dynamically re-rank candidates
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Review gap summaries showing where candidates fall short
                </li>
              </ul>
            </div>
            <Button asChild variant="outline" className="mt-auto w-fit gap-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10">
              <Link href="/signup">
                Join as Recruiter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
