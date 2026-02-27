"use client"

import { useState, useMemo, Fragment } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

import {
  Github,
  ChevronDown,
  ChevronUp,
  Star,
  GitBranch,
  Code2,
} from "lucide-react"

interface CandidateData {
  candidateId: string
  candidateName: string
  riskLevel: string
  gapSummary: string
  cgpa: number
  githubData?: any
  skillBreakdown: Record<string, number>
}

interface MatchSimulatorProps {
  jobTitle: string
  jobId: string
  initialWeights: {
    backendWeight: string | number
    consistencyWeight: string | number
    collaborationWeight: string | number
    recencyWeight: string | number
    impactWeight: string | number
  }
  initialThreshold: number
  cgpaThreshold: number | null
  cgpaCondition: string | null
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
  cgpaThreshold,
  cgpaCondition,
  candidates,
}: MatchSimulatorProps) {
  const [weights, setWeights] = useState<any>(initialWeights)
  const [minThreshold, setMinThreshold] = useState(initialThreshold)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const rankedCandidates = useMemo(
    () => simulateRanking(candidates, weights, minThreshold),
    [candidates, weights, minThreshold]
  )

  const chartData = rankedCandidates.map((c) => ({
    name: c.candidateName.split(" ")[0],
    score: Math.round(c.fitScore * 10) / 10,
  }))

  const priorityFields = [
    { key: "backendWeight", label: "Backend / Complexity" },
    { key: "consistencyWeight", label: "Consistency" },
    { key: "collaborationWeight", label: "Collaboration" },
    { key: "recencyWeight", label: "Recency" },
    { key: "impactWeight", label: "Impact" },
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Match Simulator</h1>
          <p className="text-muted-foreground">{jobTitle} - Analysis & Priorities</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sliders Panel */}
        <Card className="bg-card lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Priorities
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
            <CardDescription>
              Adjust priorities to see how they affect top candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {priorityFields.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-card-foreground">{label}</Label>
                </div>
                <Select
                  value={String(weights[key])}
                  onValueChange={(v) => setWeights((prev: any) => ({ ...prev, [key]: v }))}
                >
                  <SelectTrigger className="bg-background h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical (2.0x)</SelectItem>
                    <SelectItem value="important">Important (1.3x)</SelectItem>
                    <SelectItem value="optional">Optional (1.0x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Min Fit Score (%)</Label>
                <span className="text-xs font-mono text-muted-foreground">{minThreshold}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[minThreshold]}
                onValueChange={([v]) => setMinThreshold(v)}
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGPA Threshold:</span>
                <span className="font-medium">{cgpaThreshold ?? "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGPA Condition:</span>
                <span className="font-medium capitalize">{cgpaCondition ?? "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6 lg:col-span-2">
          {/* Bar chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Normalized Fit Score Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
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
                    <Bar dataKey="score" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  No candidates matching these criteria
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ranked Table */}
          <Card className="bg-card">
            <CardHeader className="py-4">
              <CardTitle className="text-card-foreground text-lg">
                Candidate Ranking ({rankedCandidates.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {rankedCandidates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-8"></TableHead>
                      <TableHead className="w-10 text-center">#</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead className="text-right">Fit Score</TableHead>
                      <TableHead className="text-center">Risk</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedCandidates.map((match, i) => {
                      const cand = candidates.find(
                        (c) => c.candidateId === match.candidateId
                      )
                      const isExpanded = expandedRow === match.candidateId

                      // CGPA Status Check
                      let cgpaPass = true
                      if (cgpaThreshold !== null && cgpaCondition !== null) {
                        if (cgpaCondition === "above") cgpaPass = (cand?.cgpa ?? 0) >= cgpaThreshold
                        else if (cgpaCondition === "below") cgpaPass = (cand?.cgpa ?? 0) <= cgpaThreshold
                      }

                      return (
                        <Fragment key={match.candidateId}>
                          <TableRow
                            className="cursor-pointer hover:bg-muted/20"
                            onClick={() => setExpandedRow(isExpanded ? null : match.candidateId)}
                          >
                            <TableCell className="p-0 text-center">
                              {cand?.githubData ? (
                                <Github className="h-4 w-4 mx-auto text-muted-foreground opacity-50" />
                              ) : null}
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                              {i + 1}
                            </TableCell>
                            <TableCell className="font-medium text-card-foreground">
                              {match.candidateName}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                  {cand?.cgpa?.toFixed(2) ?? "0.00"}
                                </div>
                                <Badge variant="outline" className={`text-[10px] h-4 py-0 px-1 border-0 ${cgpaPass ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                  {cgpaPass ? "PASS" : "FAIL"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-lg font-bold text-accent">
                                {match.fitScore.toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={`text-[10px] py-0 px-1.5 ${getRiskBadgeClass(match.riskLevel)}`}
                              >
                                {match.riskLevel}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow className="bg-muted/10 border-b-0">
                              <TableCell colSpan={7} className="p-4">
                                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                  {cand?.githubData ? (
                                    <div className="space-y-3">
                                      <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <Github className="h-4 w-4" />
                                        GitHub Insights
                                      </h4>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-card rounded-md p-2 border border-border">
                                          <p className="text-[10px] text-muted-foreground uppercase">Repos</p>
                                          <p className="text-lg font-bold">{cand.githubData.publicRepos}</p>
                                        </div>
                                        <div className="bg-card rounded-md p-2 border border-border">
                                          <p className="text-[10px] text-muted-foreground uppercase">Stars</p>
                                          <p className="text-lg font-bold">{cand.githubData.totalStars}</p>
                                        </div>
                                        <div className="bg-card rounded-md p-2 border border-border col-span-2">
                                          <p className="text-[10px] text-muted-foreground uppercase">Top Languages</p>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {Object.keys(cand.githubData.languages).slice(0, 3).map(lang => (
                                              <Badge key={lang} variant="secondary" className="text-[10px] py-0">{lang}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <h4 className="flex items-center gap-2 text-sm font-semibold opacity-50">
                                        <Github className="h-4 w-4" />
                                        GitHub Insights
                                      </h4>
                                      <p className="text-xs text-muted-foreground italic">No GitHub account linked</p>
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                      <GitBranch className="h-4 w-4" />
                                      Recent Activity
                                    </h4>
                                    {cand?.githubData?.recentRepos?.length > 0 ? (
                                      <ul className="space-y-1.5">
                                        {cand.githubData.recentRepos.map((repo: any) => (
                                          <li key={repo.name} className="text-xs border-b border-border/50 pb-1 flex justify-between items-center">
                                            <span className="font-medium truncate max-w-[120px]">{repo.name}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                              {new Date(repo.updatedAt).toLocaleDateString()}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">Analysis based on skills & profile metadata.</p>
                                    )}
                                  </div>

                                  <div className="col-span-2 bg-accent/5 rounded-md p-3 border border-accent/10">
                                    <p className="text-[10px] text-accent font-bold uppercase mb-1">Qualitative Analysis</p>
                                    <p className="text-xs italic leading-relaxed">{match.gapSummary}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                          {/* End of expanded row content */}
                        </Fragment>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
                  No candidates meet the fit criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
