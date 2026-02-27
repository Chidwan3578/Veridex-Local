import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Hiring Intelligence Platform</span>
        </div>

        <h1 className="text-balance text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
          Verify talent with{" "}
          <span className="text-primary">data-driven</span>{" "}
          credibility scoring
        </h1>

        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Multi-factor skill analysis, risk assessment, and weighted matching
          algorithms that go beyond resumes to surface truly qualified
          candidates.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8 text-base">
            <Link href="/signup">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 px-8 text-base"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
