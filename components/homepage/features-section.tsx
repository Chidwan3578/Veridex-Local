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

export function FeaturesSection() {
  return (
    <section className="border-t border-border/50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Platform Capabilities
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to evaluate talent intelligently
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/50 bg-border/50 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-card/80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
