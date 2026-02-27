"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  ArrowLeft,
  SlidersHorizontal,
  GraduationCap,
  RotateCcw,
} from "lucide-react"
import { simulateRanking } from "@/lib/matching"

interface CandidateData {
  candidateId: string
  candidateName: string
  riskLevel: string
  gapSummary: string
  cgpa: number
  skillBreakdown: Record<string, number>
}

interface MatchSimulatorProps {
  jobTitle: string
  jobId: string
  initialWeights: {
    backendWeight: number
    consistencyWeight: number
    collaborationWeight: number
    recencyWeight: number
    impactWeight: number
    cgpaWeight: number
  }
  initialThreshold: number
  candidates: CandidateData[]
}

function getRiskBadgeClass(level: string) {
  switch (level) {
    case "Low": return "border-accent/30 bg-accent/15 text-accent"
    case "Medium": return "border-chart-3/30 bg-chart-3/15 text-chart-3"
    case "High": return "border-destructive/30 bg-destructive/15 text-destructive"
    default: return ""
  }
}

export function MatchSimulator({
  jobTitle,
  jobId,
  initialWeights,
  initialThreshold,
  candidates,
}: MatchSimulatorProps) {
  const [weights, setWeights] = useState(initialWeights)
  const [minThreshold, setMinThreshold] = useState(initialThreshold)

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)

  const rankedCandidates = useMemo(
    () => simulateRanking(candidates, weights, minThreshold),
    [candidates, weights, minThreshold]
  )

  const chartData = rankedCandidates.map((c) => ({
    name: c.candidateName.split(" ")[0],
    score: Math.round(c.fitScore * 10) / 10,
  }))

  const weightSliders = [
    { key: "backendWeight" as const, label: "Backend / Complexity" },
    { key: "consistencyWeight" as const, label: "Consistency" },
    { key: "collaborationWeight" as const, label: "Collaboration" },
    { key: "recencyWeight" as const, label: "Recency" },
    { key: "impactWeight" as const, label: "Impact" },
    { key: "cgpaWeight" as const, label: "CGPA" },
  ]

  function handleReset() {
    setWeights(initialWeights)
    setMinThreshold(initialThreshold)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/recruiter/job/${jobId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to job</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Weight Simulator</h1>
          <p className="text-muted-foreground">{jobTitle} - Dynamic ranking simulation</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sliders Panel */}
        <Card className="bg-card lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Weights
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
            <CardDescription>
              Total: <span className={`font-bold ${Math.abs(totalWeight - 1) < 0.01 ? "text-accent" : "text-destructive"}`}>
                {(totalWeight * 100).toFixed(0)}%
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {weightSliders.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-card-foreground">{label}</Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {(weights[key] * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[weights[key] * 100]}
                  onValueChange={([v]) =>
                    setWeights((prev) => ({ ...prev, [key]: v / 100 }))
                  }
                />
              </div>
            ))}

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Min Threshold</Label>
                <span className="text-xs font-mono text-muted-foreground">{minThreshold}</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[minThreshold]}
                onValueChange={([v]) => setMinThreshold(v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6 lg:col-span-2">
          {/* Bar chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Fit Score Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="name"
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
                    <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-48 items-center justify-center text-muted-foreground">
                  No candidates above threshold
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ranked Table */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Ranked Results ({rankedCandidates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankedCandidates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Fit Score</TableHead>
                      <TableHead>Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedCandidates.map((match, i) => {
                      const cand = candidates.find(
                        (c) => c.candidateId === match.candidateId
                      )
                      return (
                        <TableRow key={match.candidateId}>
                          <TableCell className="font-medium text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell className="font-medium text-card-foreground">
                            {match.candidateName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-card-foreground">
                                {cand?.cgpa.toFixed(2) ?? "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-lg font-bold text-primary">
                              {match.fitScore.toFixed(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getRiskBadgeClass(match.riskLevel)}
                            >
                              {match.riskLevel}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  No candidates above the threshold. Try lowering the minimum.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
