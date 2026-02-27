"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateProfileAction } from "@/lib/profile-actions"
import { GitHubData } from "@/lib/github"
import {
  Edit3,
  ExternalLink,
  Code,
  Star as StarIcon,
  GitBranch,
  User,
  Mail,
  Github,
  GraduationCap,
  Shield,
  Activity,
  BarChart3,
  Calendar,
  Trophy,
  Linkedin,
} from "lucide-react"
import { LeetCodeView } from "./leetcode-view"
import { LinkedInView } from "./linkedin-view"

interface CandidateProfileViewProps {
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  profile: {
    githubUsername: string
    leetcodeUsername: string | null
    leetcodeScore: number | null
    leetcodeRank: number | null
    linkedinUrl: string | null
    linkedinCertificationsCount: number | null
    linkedinCertifications: string | null
    cgpa: number
    overallScore: number
    riskScore: string
    dataCompleteness: number
    lastActiveDate: string
  } | null
  skillCount: number
  githubData: GitHubData | null
}

export function CandidateProfileView({ user, profile, skillCount, githubData }: CandidateProfileViewProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const riskColor = profile?.riskScore === "Low"
    ? "bg-accent/15 text-accent border-accent/30"
    : profile?.riskScore === "Medium"
      ? "bg-chart-3/15 text-chart-3 border-chart-3/30"
      : "bg-destructive/15 text-destructive border-destructive/30"

  async function handleUpdate(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await updateProfileAction(formData)
    setLoading(false)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error || "Update failed")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="text-muted-foreground">Your candidate overview and credibility metrics</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal metrics and GitHub link.
              </DialogDescription>
            </DialogHeader>
            <form action={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA (0-10)</Label>
                  <Input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    defaultValue={profile?.cgpa}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUsername">GitHub Username</Label>
                  <Input
                    id="githubUsername"
                    name="githubUsername"
                    defaultValue={profile?.githubUsername}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="space-y-2">
                  <Label htmlFor="leetcodeUsername">LeetCode Username</Label>
                  <Input
                    id="leetcodeUsername"
                    name="leetcodeUsername"
                    defaultValue={profile?.leetcodeUsername || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leetcodeScore">LeetCode Score</Label>
                  <Input
                    id="leetcodeScore"
                    name="leetcodeScore"
                    type="number"
                    defaultValue={profile?.leetcodeScore || 0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leetcodeRank">LeetCode Rank</Label>
                  <Input
                    id="leetcodeRank"
                    name="leetcodeRank"
                    type="number"
                    defaultValue={profile?.leetcodeRank || 0}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    placeholder="linkedin.com/in/username"
                    defaultValue={profile?.linkedinUrl || ""}
                  />
                  <p className="text-[10px] text-muted-foreground italic">Certifications will be fetched automatically.</p>
                </div>
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">External Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <LeetCodeView
              username={profile?.leetcodeUsername || null}
              score={profile?.leetcodeScore || null}
              rank={profile?.leetcodeRank || null}
            />
            <LinkedInView
              url={profile?.linkedinUrl || null}
              certificationsCount={profile?.linkedinCertificationsCount || null}
              certifications={profile?.linkedinCertifications || null}
            />
            <Card className="bg-muted/10 border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Github className="h-4 w-4 text-primary" />
                    GitHub Summary
                  </CardTitle>
                  {profile?.githubUsername && (
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                    >
                      View <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {githubData ? (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground uppercase">Repos</span>
                      </div>
                      <span className="text-lg font-bold">{githubData.publicRepos}</span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-4 w-4 text-accent" />
                        <span className="text-xs text-muted-foreground uppercase">Stars</span>
                      </div>
                      <span className="text-lg font-bold">{githubData.totalStars}</span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-chart-3" />
                        <span className="text-xs text-muted-foreground uppercase">Languages</span>
                      </div>
                      <span className="text-lg font-bold">{Object.keys(githubData.languages).length}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-4">Link GitHub to view stats.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card lg:col-span-1">
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

        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">GitHub Activity</CardTitle>
              {profile?.githubUsername && (
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary flex items-center gap-1 hover:underline card-link"
                >
                  View Profile <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {githubData ? (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Repository Updates
                </h4>
                <div className="space-y-2">
                  {githubData.recentRepos.map((repo) => (
                    <div key={repo.name} className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-muted/10">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{repo.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{repo.description || "No description"}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <Badge variant="secondary" className="text-[10px] py-0">{repo.language || "Other"}</Badge>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(repo.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center flex-col text-center space-y-2">
                <Github className="h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  Connect your GitHub to showcase your activity & repos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
            <h4 className="text-sm font-medium text-card-foreground">CGPA Credibility Progress</h4>
            <div className="flex items-end gap-1 px-2">
              {[2, 4, 6, 8, 10].map((n) => (
                <div
                  key={n}
                  className={`flex-1 rounded-t transition-all duration-500 ${(profile?.cgpa ?? 0) >= n
                    ? "bg-primary"
                    : "bg-muted"
                    }`}
                  style={{ height: `${n * 10}px` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
              <span>Thresholds:</span>
              <span>2.0</span>
              <span>4.0</span>
              <span>6.0</span>
              <span>8.0</span>
              <span>10.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
