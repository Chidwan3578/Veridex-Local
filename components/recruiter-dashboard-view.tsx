"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react"

interface JobSummary {
  id: string
  title: string
  description: string
  matchCount: number
  topScore: number
  createdAt: string
}

interface RecruiterDashboardViewProps {
  recruiterName: string
  jobs: JobSummary[]
  totalCandidates: number
}

export function RecruiterDashboardView({ recruiterName, jobs, totalCandidates }: RecruiterDashboardViewProps) {
  const totalMatches = jobs.reduce((sum, j) => sum + j.matchCount, 0)
  const avgTopScore = jobs.length > 0
    ? Math.round(jobs.reduce((sum, j) => sum + j.topScore, 0) / jobs.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {recruiterName.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">Your hiring intelligence overview</p>
        </div>
        <Link href="/recruiter/create-job">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold text-card-foreground">{jobs.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
              <p className="text-2xl font-bold text-card-foreground">{totalCandidates}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
              <BarChart3 className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-2xl font-bold text-card-foreground">{totalMatches}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10">
              <TrendingUp className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Top Score</p>
              <p className="text-2xl font-bold text-card-foreground">{avgTopScore}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs list */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Your Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-card-foreground">{job.title}</h3>
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        {job.matchCount} matches
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Top Score</p>
                      <p className="text-lg font-bold text-primary">{job.topScore}</p>
                    </div>
                    <Link href={`/recruiter/job/${job.id}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View job</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-card-foreground">No jobs yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Create your first job to start matching candidates</p>
              <Link href="/recruiter/create-job">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Job
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
