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
  Download,
  AlertCircle,
} from "lucide-react"
import { simulateRanking } from "@/lib/matching"

import {
  Github,
  ChevronDown,
  ChevronUp,
  Star,
  GitBranch,
  Code2,
  Sparkles,
  CheckCircle2,
  Trash2,
  User,
} from "lucide-react"

interface CandidateData {
  candidateId: string
  candidateName: string
  riskLevel: string
  gapSummary: string
  cgpa: number
  githubData?: any
  resumeText?: string | null
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
    case "Low": return "border-primary/30 bg-primary/10 text-primary"
    case "Medium": return "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
    case "High": return "border-red-500/30 bg-red-500/10 text-red-500"
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
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"simulator" | "applicants">("simulator")

  const handleReset = () => {
    setWeights(initialWeights)
    setMinThreshold(initialThreshold)
  }

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

  function downloadJson(data: any, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function exportFullReport() {
    const report = {
      jobTitle,
      timestamp: new Date().toISOString(),
      weights,
      minThreshold,
      candidates: rankedCandidates.map(c => ({
        name: c.candidateName,
        fitScore: c.fitScore,
        riskLevel: c.riskLevel,
        skillBreakdown: c.skillBreakdown,
        gapSummary: c.gapSummary
      }))
    }
    downloadJson(report, `${jobTitle.replace(/\s+/g, "_")}_Match_Report.json`)
  }

  function exportCandidateStats(candidate: CandidateData, match: any) {
    const stats = {
      candidateName: candidate.candidateName,
      exportedAt: new Date().toISOString(),
      matchDetails: {
        jobTitle,
        fitScore: match.fitScore,
        riskLevel: match.riskLevel,
        suitability: match.fitScore >= 80 ? "Highly Suitable" : match.fitScore >= 60 ? "Good Match" : "Moderate Match"
      },
      skillBreakdown: candidate.skillBreakdown,
      githubData: candidate.githubData,
      quantitativeAnalysis: match.gapSummary
    }
    downloadJson(stats, `${candidate.candidateName.replace(/\s+/g, "_")}_Stats.json`)
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
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">Match Engine</h1>
            <p className="text-muted-foreground italic">Optimize talent identification through data-driven alignment</p>
          </div>
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === "simulator" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("simulator")}
              className="h-8 text-xs font-bold"
            >
              Match Simulator
            </Button>
            <Button
              variant={activeTab === "applicants" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("applicants")}
              className="h-8 text-xs font-bold"
            >
              Job Applicants
            </Button>
          </div>
        </div>
      </div>

      {activeTab === "simulator" ? (
        <div className="grid gap-6 lg:grid-cols-4">
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
                <div key={key} className="space-y-3 py-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-card-foreground">{label}</Label>
                    <span className="text-[10px] font-bold uppercase text-primary">
                      {weights[key] === "critical" ? "High" : weights[key] === "important" ? "Medium" : "Low"}
                    </span>
                  </div>
                  <div className="px-1">
                    <Slider
                      min={0}
                      max={2}
                      step={1}
                      value={[
                        weights[key] === "critical" ? 2 : weights[key] === "important" ? 1 : 0
                      ]}
                      onValueChange={([v]) => {
                        const val = v === 2 ? "critical" : v === 1 ? "important" : "optional"
                        setWeights((prev: any) => ({ ...prev, [key]: val }))
                      }}
                    />
                    <div className="mt-1.5 flex justify-between text-[9px] font-bold uppercase tracking-tight text-muted-foreground/50">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
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
          <div className="space-y-6 lg:col-span-3">
            {/* Bar chart */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">Normalized Fit Score Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2e1065" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={{ stroke: '#2e1065' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={{ stroke: '#2e1065' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050505",
                          border: "1px solid #2e1065",
                          borderRadius: "8px",
                          color: "#f8fafc",
                        }}
                        itemStyle={{ color: "#7c3aed" }}
                        cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                      />
                      <Bar dataKey="score" fill="#7c3aed" radius={[4, 4, 0, 0]} />
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground text-lg">
                    Candidate Ranking ({rankedCandidates.length})
                  </CardTitle>
                  {rankedCandidates.length > 0 && (
                    <Button variant="outline" size="sm" onClick={exportFullReport} className="gap-2 h-8 text-xs border-primary/20 hover:bg-primary/5">
                      <Download className="h-3 w-3" />
                      Download Full Report
                    </Button>
                  )}
                </div>
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
                        const isExpanded = expandedId === match.candidateId

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
                              onClick={() => setExpandedId(isExpanded ? null : match.candidateId)}
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
                                        <Sparkles className="h-4 w-4 text-accent" />
                                        Verified Credentials
                                      </h4>
                                      {cand?.resumeText ? (
                                        <div className="space-y-4">
                                          <div>
                                            <p className="text-[10px] text-accent font-bold uppercase mb-2 flex items-center gap-1">
                                              <CheckCircle2 className="h-3 w-3" />
                                              Verified Skills (Resume + GitHub)
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                              {Object.keys(cand.skillBreakdown)
                                                .filter(s => s !== 'cgpa')
                                                .map(s => {
                                                  const labels: Record<string, string> = {
                                                    complexity: "Backend Depth",
                                                    consistency: "Consistency",
                                                    collaboration: "Collaboration",
                                                    recency: "Recency",
                                                    impact: "Impact"
                                                  }
                                                  const fullName = labels[s] || s
                                                  const isVerified = cand.resumeText?.toLowerCase().includes(fullName.toLowerCase()) ||
                                                    cand.resumeText?.toLowerCase().includes("python") ||
                                                    cand.resumeText?.toLowerCase().includes("react") ||
                                                    cand.resumeText?.toLowerCase().includes("node")

                                                  if (isVerified) {
                                                    return (
                                                      <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5 bg-accent/5 text-accent border-accent/20">
                                                        {fullName}
                                                      </Badge>
                                                    )
                                                  }
                                                  return null
                                                })}
                                            </div>
                                          </div>

                                          <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase mb-2 flex items-center gap-1">
                                              <AlertCircle className="h-3 w-3" />
                                              Evidence Only (Missing from Resume)
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                              {Object.keys(cand.skillBreakdown)
                                                .filter(s => s !== 'cgpa')
                                                .map(s => {
                                                  const labels: Record<string, string> = {
                                                    complexity: "Backend Depth",
                                                    consistency: "Consistency",
                                                    collaboration: "Collaboration",
                                                    recency: "Recency",
                                                    impact: "Impact"
                                                  }
                                                  const fullName = labels[s] || s
                                                  const isVerified = cand.resumeText?.toLowerCase().includes(fullName.toLowerCase()) ||
                                                    cand.resumeText?.toLowerCase().includes("python") ||
                                                    cand.resumeText?.toLowerCase().includes("react") ||
                                                    cand.resumeText?.toLowerCase().includes("node")

                                                  if (!isVerified) {
                                                    return (
                                                      <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5 border-dashed">
                                                        {fullName}
                                                      </Badge>
                                                    )
                                                  }
                                                  return null
                                                })}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground italic">No resume uploaded for verification</p>
                                      )}
                                    </div>

                                    <div className="col-span-2 bg-accent/5 rounded-md p-3 border border-accent/10 flex items-start justify-between gap-4">
                                      <div>
                                        <p className="text-[10px] text-accent font-bold uppercase mb-1">Qualitative Analysis</p>
                                        <p className="text-xs italic leading-relaxed">{match.gapSummary}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => cand && exportCandidateStats(cand, match)}
                                        className="h-7 px-2 text-[10px] gap-1 hover:bg-accent/10 hover:text-accent"
                                      >
                                        <Download className="h-3 w-3" />
                                        Export Stats
                                      </Button>
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
      ) : (
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Active Applicants ({candidates.length})
              </CardTitle>
            </div>
            <CardDescription>
              Review all candidates who have formally applied to this position.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {candidates.map((cand) => {
                const match = rankedCandidates.find(rc => rc.candidateId === cand.candidateId)
                const isExpanded = expandedId === cand.candidateId

                return (
                  <Card
                    key={cand.candidateId}
                    className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/30'}`}
                    onClick={() => setExpandedId(isExpanded ? null : cand.candidateId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {cand.candidateName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-card-foreground">{cand.candidateName}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${getRiskBadgeClass(match?.riskLevel || "Low")}`}>
                                {match?.riskLevel || "Low"} Risk
                              </Badge>
                              {cand.resumeText && (
                                <Badge className="bg-accent/15 text-accent border-accent/20 text-[10px] py-0 px-1.5 gap-1">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Score</p>
                            <p className="text-xl font-black text-primary">{match?.fitScore.toFixed(0)}%</p>
                          </div>
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Technical Evidence */}
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold">
                                  <Github className="h-4 w-4" />
                                  GitHub Insights
                                </h4>
                                {cand?.githubData ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-muted/50 rounded-md p-2 border border-border">
                                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Public Repos</p>
                                      <p className="text-lg font-bold">{cand.githubData.publicRepos}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-md p-2 border border-border">
                                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Stars</p>
                                      <p className="text-lg font-bold">{cand.githubData.totalStars}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">No GitHub account linked</p>
                                )}
                              </div>

                              <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold">
                                  <Sparkles className="h-4 w-4 text-accent" />
                                  Verified Credentials
                                </h4>
                                {cand?.resumeText ? (
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-[10px] text-accent font-bold uppercase mb-2 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Verified By Resume
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {Object.keys(cand.skillBreakdown)
                                          .filter(s => s !== 'cgpa')
                                          .map(s => {
                                            const labels: Record<string, string> = {
                                              complexity: "Backend Depth",
                                              consistency: "Consistency",
                                              collaboration: "Collaboration",
                                              recency: "Recency",
                                              impact: "Impact"
                                            }
                                            const fullName = labels[s] || s
                                            const isVerified = cand.resumeText?.toLowerCase().includes(fullName.toLowerCase()) ||
                                              cand.resumeText?.toLowerCase().includes("python") ||
                                              cand.resumeText?.toLowerCase().includes("react") ||
                                              cand.resumeText?.toLowerCase().includes("node")

                                            if (isVerified) {
                                              return (
                                                <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5 bg-accent/5 text-accent border-accent/20">
                                                  {fullName}
                                                </Badge>
                                              )
                                            }
                                            return null
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">No resume uploaded</p>
                                )}
                              </div>
                            </div>

                            {/* Analysis */}
                            <div className="space-y-6">
                              <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Qualitative Analysis</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      cand && match && exportCandidateStats(cand, match)
                                    }}
                                    className="h-6 px-2 text-[9px] gap-1 hover:bg-accent/10 hover:text-accent"
                                  >
                                    <Download className="h-3 w-3" />
                                    Export
                                  </Button>
                                </div>
                                <p className="text-xs italic leading-relaxed text-muted-foreground">{match?.gapSummary}</p>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Skill Alignment</p>
                                <div className="space-y-2">
                                  {Object.entries(cand.skillBreakdown).slice(0, 4).map(([skill, score]) => (
                                    <div key={skill} className="space-y-1">
                                      <div className="flex justify-between text-[10px]">
                                        <span className="capitalize">{skill}</span>
                                        <span className="font-mono">{score.toFixed(0)}%</span>
                                      </div>
                                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${score}%` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
