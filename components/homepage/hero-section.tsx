// Server Component
import { Shield } from "lucide-react"
import { SplineSection } from "./spline-section"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-start overflow-hidden bg-transparent pt-16">
      <SplineSection />

      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center pointer-events-none">
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm pointer-events-auto">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Hiring Intelligence Platform</span>
        </div>
      </div>
    </section>
  )
}
