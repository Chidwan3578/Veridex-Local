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
    <section className="bg-[#030303] px-6 py-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/30 p-8 shadow-2xl backdrop-blur-2xl transition-all hover:bg-card/50 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
