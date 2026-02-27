"use client"

import { useState } from "react"
import { createJobAction } from "@/lib/job-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Briefcase } from "lucide-react"

export default function CreateJobPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [weights, setWeights] = useState({
    backendWeight: 0.25,
    consistencyWeight: 0.20,
    collaborationWeight: 0.15,
    recencyWeight: 0.15,
    impactWeight: 0.15,
    cgpaWeight: 0.10,
  })
  const [minThreshold, setMinThreshold] = useState(50)

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    Object.entries(weights).forEach(([key, value]) => {
      formData.set(key, value.toString())
    })
    formData.set("minThreshold", minThreshold.toString())
    const result = await createJobAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const weightSliders = [
    { key: "backendWeight" as const, label: "Backend / Complexity" },
    { key: "consistencyWeight" as const, label: "Consistency" },
    { key: "collaborationWeight" as const, label: "Collaboration" },
    { key: "recencyWeight" as const, label: "Recency" },
    { key: "impactWeight" as const, label: "Impact" },
    { key: "cgpaWeight" as const, label: "CGPA" },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Job</h1>
        <p className="text-muted-foreground">Define a job posting and set matching weights</p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Briefcase className="h-4 w-4" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-card-foreground">Job Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Senior Full-Stack Engineer"
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-card-foreground">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities, and ideal candidate..."
                required
                rows={4}
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Matching Weights</CardTitle>
            <CardDescription>
              Adjust how each dimension affects candidate ranking.
              Total: <span className={`font-bold ${Math.abs(totalWeight - 1) < 0.01 ? "text-accent" : "text-destructive"}`}>
                {(totalWeight * 100).toFixed(0)}%
              </span>
              {Math.abs(totalWeight - 1) > 0.01 && (
                <span className="text-destructive"> (should be 100%)</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {weightSliders.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-card-foreground">{label}</Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {(weights[key] * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[weights[key] * 100]}
                  onValueChange={([v]) => setWeights((prev) => ({ ...prev, [key]: v / 100 }))}
                />
              </div>
            ))}

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-card-foreground">Minimum Threshold</Label>
                <span className="text-sm font-mono text-muted-foreground">{minThreshold}</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[minThreshold]}
                onValueChange={([v]) => setMinThreshold(v)}
              />
              <p className="text-xs text-muted-foreground">
                Candidates scoring below this threshold will be filtered out
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating job & matching..." : "Create Job & Run Matching"}
        </Button>
      </form>
    </div>
  )
}
