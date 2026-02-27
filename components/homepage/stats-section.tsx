import { Activity, BarChart3, Brain, ShieldCheck } from "lucide-react"

const stats = [
  {
    value: "7-Factor",
    label: "Credibility scoring across complexity, consistency, collaboration, recency, impact, certification, and CGPA.",
    icon: Brain,
  },
  {
    value: "Real-time",
    label: "Risk assessment flagging inactivity, score variance, low collaboration, and single-skill dominance.",
    icon: ShieldCheck,
  },
  {
    value: "Weighted",
    label: "Candidate-job matching with adjustable weight sliders that re-rank results instantly.",
    icon: BarChart3,
  },
  {
    value: "Decay-aware",
    label: "Time-based decay factors ensure recent activity is weighted more than stale contributions.",
    icon: Activity,
  },
]

export function StatsSection() {
  return (
    <section className="border-t border-border/50 bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.value} className="flex flex-col gap-3 p-8 lg:p-10">
            <stat.icon className="h-5 w-5 text-primary" />
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
