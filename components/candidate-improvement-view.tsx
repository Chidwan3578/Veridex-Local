"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react"
import type { ScoreBreakdown } from "@/lib/scoring"

interface ScoredSkill {
  name: string
  score: number
  breakdown: ScoreBreakdown
}

interface CandidateImprovementViewProps {
  skills: ScoredSkill[]
  riskAssessment: {
    level: string
    factors: string[]
    score: number
  }
  cgpa: number
  overallScore: number
}

function getImprovementSuggestions(skills: ScoredSkill[], cgpa: number): string[] {
  const suggestions: string[] = []

  skills.forEach((skill) => {
    if (skill.breakdown.collaboration < 60) {
      suggestions.push(`Improve collaboration on ${skill.name} by contributing to open-source projects or team-based work.`)
    }
    if (skill.breakdown.recency < 60) {
      suggestions.push(`Increase recent activity in ${skill.name} to improve recency scores.`)
    }
    if (skill.breakdown.certification < 50) {
      suggestions.push(`Earn certifications for ${skill.name} to boost your credential score.`)
    }
    if (skill.breakdown.complexity < 60) {
      suggestions.push(`Take on more complex ${skill.name} projects to demonstrate advanced proficiency.`)
    }
  })

  if (cgpa < 3.0) {
    suggestions.push("Focus on improving academic performance to strengthen your normalized CGPA score.")
  }

  if (skills.length < 3) {
    suggestions.push("Add more skills to your profile to improve data completeness and demonstrate versatility.")
  }

  return suggestions.slice(0, 6)
}

export function CandidateImprovementView({
  skills,
  riskAssessment,
  cgpa,
  overallScore,
}: CandidateImprovementViewProps) {
  const suggestions = getImprovementSuggestions(skills, cgpa)

  const riskColor = riskAssessment.level === "Low"
    ? "bg-accent/15 text-accent border-accent/30"
    : riskAssessment.level === "Medium"
    ? "bg-chart-3/15 text-chart-3 border-chart-3/30"
    : "bg-destructive/15 text-destructive border-destructive/30"

  const riskIcon = riskAssessment.level === "Low"
    ? <CheckCircle2 className="h-5 w-5 text-accent" />
    : riskAssessment.level === "Medium"
    ? <AlertTriangle className="h-5 w-5 text-chart-3" />
    : <AlertTriangle className="h-5 w-5 text-destructive" />

  // Find weakest and strongest skills
  const sortedSkills = [...skills].sort((a, b) => a.breakdown.finalScore - b.breakdown.finalScore)
  const weakest = sortedSkills.length > 0 ? sortedSkills[0] : null
  const strongest = sortedSkills.length > 0 ? sortedSkills[sortedSkills.length - 1] : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Improvement Plan</h1>
        <p className="text-muted-foreground">Actionable insights to boost your credibility score</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Score</p>
              <p className="text-2xl font-bold text-card-foreground">{overallScore}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            {riskIcon}
            <div>
              <p className="text-sm text-muted-foreground">Risk Assessment</p>
              <Badge variant="outline" className={riskColor}>
                {riskAssessment.level} Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Gain</p>
              <p className="text-2xl font-bold text-card-foreground">+{Math.max(5, Math.round((100 - overallScore) * 0.3))}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Factors */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <AlertTriangle className="h-4 w-4 text-chart-3" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskAssessment.factors.length > 0 ? (
              <ul className="space-y-3">
                {riskAssessment.factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-chart-3" />
                    <span className="text-sm text-card-foreground">{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                No risk factors detected. Great job!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Lightbulb className="h-4 w-4 text-chart-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.length > 0 ? (
              <ul className="space-y-3">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-card-foreground">{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                Your profile looks excellent!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skill breakdown comparison */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Skill Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    {skill.breakdown.decayApplied && (
                      <Badge variant="outline" className="border-chart-3/30 bg-chart-3/10 text-chart-3 text-xs">
                        Decay Applied
                      </Badge>
                    )}
                    <span className="text-sm font-bold text-primary">{skill.breakdown.finalScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${skill.breakdown.finalScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
