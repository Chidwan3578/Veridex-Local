"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Github,
  GraduationCap,
  Shield,
  Activity,
  BarChart3,
  Calendar,
} from "lucide-react"

interface CandidateProfileViewProps {
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  profile: {
    githubUsername: string
    cgpa: number
    overallScore: number
    riskScore: string
    dataCompleteness: number
    lastActiveDate: string
  } | null
  skillCount: number
}

export function CandidateProfileView({ user, profile, skillCount }: CandidateProfileViewProps) {
  const riskColor = profile?.riskScore === "Low"
    ? "bg-accent/15 text-accent border-accent/30"
    : profile?.riskScore === "Medium"
    ? "bg-chart-3/15 text-chart-3 border-chart-3/30"
    : "bg-destructive/15 text-destructive border-destructive/30"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-muted-foreground">Your candidate overview and credibility metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-2xl font-bold text-card-foreground">{profile?.overallScore ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="text-2xl font-bold text-card-foreground">{profile?.cgpa?.toFixed(2) ?? "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
              <Activity className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <Badge variant="outline" className={`mt-1 ${riskColor}`}>
                {profile?.riskScore ?? "Unknown"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10">
              <BarChart3 className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skills Tracked</p>
              <p className="text-2xl font-bold text-card-foreground">{skillCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-card-foreground">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-card-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Github className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">GitHub</p>
                <p className="font-medium text-card-foreground">
                  {profile?.githubUsername || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Last Active</p>
                <p className="font-medium text-card-foreground">
                  {profile?.lastActiveDate
                    ? new Date(profile.lastActiveDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Data Completeness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="font-medium text-card-foreground">{profile?.dataCompleteness ?? 0}%</span>
              </div>
              <Progress value={profile?.dataCompleteness ?? 0} className="h-2" />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-card-foreground">CGPA Scale</h4>
              <div className="flex items-end gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`flex-1 rounded-t transition-all ${
                      (profile?.cgpa ?? 0) >= n
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                    style={{ height: `${n * 16 + 8}px` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
