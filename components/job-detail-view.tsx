"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Calendar,
  ArrowRight,
  Trophy,
  GraduationCap,
} from "lucide-react"

interface MatchData {
  id: string
  candidateId: string
  candidateName: string
  fitScore: number
  riskLevel: string
  gapSummary: string
  cgpa: number
}

interface JobDetailViewProps {
  job: {
    id: string
    title: string
    description: string
    backendWeight: number | string
    consistencyWeight: number | string
    collaborationWeight: number | string
    recencyWeight: number | string
    impactWeight: number | string
    cgpaWeight: number | string
    minThreshold: number
    createdAt: string
  }
  matches: MatchData[]
}

function getRiskBadgeClass(level: string) {
  switch (level) {
    case "Low": return "border-accent/30 bg-accent/15 text-accent"
    case "Medium": return "border-chart-3/30 bg-chart-3/15 text-chart-3"
    case "High": return "border-destructive/30 bg-destructive/15 text-destructive"
    default: return ""
  }
}

export function JobDetailView({ job, matches }: JobDetailViewProps) {
  const getWeightDisplay = (val: number | string) => {
    if (typeof val === "string") {
      const label = val.charAt(0).toUpperCase() + val.slice(1)
      const percent = val === "critical" ? 100 : val === "important" ? 65 : 35
      return { label, percent, text: label }
    }
    const num = Number(val)
    return { label: "", percent: num * 100, text: `${(num * 100).toFixed(0)}%` }
  }

  const weightItems = [
    { label: "Backend", value: job.backendWeight },
    { label: "Consistency", value: job.consistencyWeight },
    { label: "Collaboration", value: job.collaborationWeight },
    { label: "Recency", value: job.recencyWeight },
    { label: "Impact", value: job.impactWeight },
    { label: "CGPA", value: job.cgpaWeight },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{job.title}</h1>
          <p className="text-muted-foreground">{job.description}</p>
        </div>
        <Link href={`/recruiter/match/${job.id}`}>
          <Button className="gap-2">
            <Trophy className="h-4 w-4" />
            Match Engine
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Matched Candidates</p>
              <p className="text-xl font-bold text-card-foreground">{matches.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <Trophy className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Top Fit Score</p>
              <p className="text-xl font-bold text-card-foreground">
                {matches.length > 0 ? matches[0].fitScore.toFixed(1) : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <Calendar className="h-5 w-5 text-chart-3" />
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm font-bold text-card-foreground">
                {new Date(job.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weights */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Matching Weights</CardTitle>
          <CardDescription>Min threshold: {job.minThreshold}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {weightItems.map((w) => {
              const display = getWeightDisplay(w.value)
              return (
                <div key={w.label} className="space-y-1 text-center">
                  <p className="text-xs text-muted-foreground">{w.label}</p>
                  <p className="text-lg font-bold text-primary">{display.text}</p>
                  <div className="mx-auto h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${display.percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Ranked Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Fit Score</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="hidden md:table-cell">Gap Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match, i) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium text-card-foreground">{match.candidateName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-card-foreground">{match.cgpa.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-bold text-primary">{match.fitScore.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRiskBadgeClass(match.riskLevel)}>
                        {match.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-xs text-sm text-muted-foreground md:table-cell">
                      <span className="line-clamp-2">{match.gapSummary}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No candidates matched the threshold criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
