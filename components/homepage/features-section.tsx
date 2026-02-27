"use client"

import {
  Radar,
  SlidersHorizontal,
  AlertTriangle,
  TrendingUp,
  Users,
  LineChart,
} from "lucide-react"

const features = [
  {
    icon: Radar,
    title: "Skill Radar Analysis",
    description:
      "Visualize candidate strengths across six dimensions with interactive radar charts. Instantly see where skills excel or need development.",
  },
  {
    icon: SlidersHorizontal,
    title: "Weight Simulation",
    description:
      "Adjust scoring weights in real-time with interactive sliders. Re-rank candidates dynamically as you tune what matters most for each role.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Flagging",
    description:
      "Automatically detect inactivity, score variance, low collaboration, poor CGPA, and single-skill dominance with color-coded risk badges.",
  },
  {
    icon: TrendingUp,
    title: "Improvement Roadmap",
    description:
      "Candidates receive actionable improvement suggestions and a clear breakdown of which factors are pulling their score down.",
  },
  {
    icon: Users,
    title: "Candidate Matching",
    description:
      "Match job requirements to candidate profiles using configurable weighted algorithms. See fit scores, gap summaries, and ranked results.",
  },
  {
    icon: LineChart,
    title: "Score Timeline",
    description:
      "Track scoring history over time with line charts. Understand consistency patterns and identify contribution spikes or declines.",
  },
]

import dynamic from "next/dynamic"

const ShaderGradient = dynamic(
  () => import("@/components/ui/shader-gradient-wrapper").then((mod) => mod.ShaderGradientWrapper),
  { ssr: false }
)

export function FeaturesSection() {
  return (
    <section className="relative border-t border-border/50 px-6 py-32 overflow-hidden">
      {/* 3D Background Gradient */}
      <ShaderGradient />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Platform Capabilities
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to evaluate talent intelligently
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-card/30 p-8 shadow-2xl backdrop-blur-2xl transition-all hover:bg-card/50 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border border-white/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
