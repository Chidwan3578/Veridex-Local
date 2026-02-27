import Link from "next/link"
import { ArrowRight, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RolesSection() {
  return (
    <section className="border-t border-border/50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
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
          <div className="group relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-foreground">
                For Candidates
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
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
            <Button asChild variant="outline" className="mt-auto w-fit gap-2">
              <Link href="/signup">
                Join as Candidate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Recruiter Card */}
          <div className="group relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border/50 bg-card p-8 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Briefcase className="h-6 w-6 text-accent" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-foreground">
                For Recruiters
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
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
            <Button asChild variant="outline" className="mt-auto w-fit gap-2">
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
