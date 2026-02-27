"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface SkillData {
  id: string
  name: string
  score: number
  complexityScore: number
  consistencyScore: number
  collaborationScore: number
  recencyScore: number
  impactScore: number
  certificationBonus: number
  history: Array<{ month: string; score: number }>
}

interface CandidateSkillsViewProps {
  skills: SkillData[]
  cgpa: number
}

const DOMAIN_COLORS = [
  "#3b82f6", // Blue (Changed from primary black)
  "#10b981", // Success / Green
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
]

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export function CandidateSkillsView({ skills, cgpa }: CandidateSkillsViewProps) {
  // Radar chart data: average of each dimension across all skills
  const radarData = skills.length > 0
    ? [
      { dimension: "Complexity", value: Math.round(skills.reduce((s, sk) => s + sk.complexityScore, 0) / skills.length) },
      { dimension: "Consistency", value: Math.round(skills.reduce((s, sk) => s + sk.consistencyScore, 0) / skills.length) },
      { dimension: "Collaboration", value: Math.round(skills.reduce((s, sk) => s + sk.collaborationScore, 0) / skills.length) },
      { dimension: "Recency", value: Math.round(skills.reduce((s, sk) => s + sk.recencyScore, 0) / skills.length) },
      { dimension: "Impact", value: Math.round(skills.reduce((s, sk) => s + sk.impactScore, 0) / skills.length) },
      { dimension: "Certification", value: Math.round(skills.reduce((s, sk) => s + sk.certificationBonus, 0) / skills.length) },
    ]
    : []

  // Timeline data: merge all skill histories
  const allMonths = skills.length > 0 ? skills[0].history.map((h) => h.month) : []
  const timelineData = allMonths.map((month) => {
    const entry: Record<string, string | number> = { month }
    skills.forEach((skill) => {
      const histItem = skill.history.find((h) => h.month === month)
      entry[skill.name] = histItem?.score ?? 0
    })
    return entry
  })

  const radarDataMulti = radarData.map((d, i) => {
    const entry: any = { ...d }
    radarData.forEach((_, j) => {
      const nextJ = (j + 1) % radarData.length
      if (i === j || i === nextJ) {
        entry[`v_${j}`] = d.value
      } else {
        entry[`v_${j}`] = 0
      }
    })
    return entry
  })

  const CustomPolarAngleAxisTick = (props: any) => {
    const { x, y, payload, index, cx, cy } = props
    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : x < cx ? "end" : "middle"}
        dominantBaseline="central"
        fill={DOMAIN_COLORS[index % DOMAIN_COLORS.length]}
        fontSize={12}
        fontWeight="600"
      >
        {payload.value}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Skills Analysis</h1>
        <p className="text-muted-foreground">Detailed breakdown of your skill credibility scores</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Skill Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarDataMulti} outerRadius="80%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={(props) => <CustomPolarAngleAxisTick {...props} />}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                  />
                  {radarData.map((_, i) => (
                    <Radar
                      key={i}
                      name={radarData[i].dimension}
                      dataKey={`v_${i}`}
                      stroke={DOMAIN_COLORS[i]}
                      fill={DOMAIN_COLORS[i]}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-card-foreground)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No skills data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* CGPA Panel */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 py-8">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary/20">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{cgpa.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">out of 10.00</p>
              </div>
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="8"
                  strokeDasharray={`${(cgpa / 10) * 452.4} 452.4`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Normalized Score: <span className="font-semibold text-card-foreground">{((cgpa / 10) * 100).toFixed(0)}/100</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Skill Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Legend />
                {skills.map((skill, i) => (
                  <Line
                    key={skill.id}
                    type="monotone"
                    dataKey={skill.name}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "var(--color-card)" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              No timeline data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, i) => (
          <Card key={skill.id} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base text-card-foreground">{skill.name}</CardTitle>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary"
              >
                {skill.score}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: "Complexity", value: skill.complexityScore },
                  { label: "Consistency", value: skill.consistencyScore },
                  { label: "Collaboration", value: skill.collaborationScore },
                  { label: "Recency", value: skill.recencyScore },
                  { label: "Impact", value: skill.impactScore },
                  { label: "Certification", value: skill.certificationBonus },
                ].map((dim) => (
                  <div key={dim.label} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-muted-foreground">{dim.label}</span>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-primary transition-all"
                          style={{ width: `${dim.value}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-card-foreground">
                      {dim.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
