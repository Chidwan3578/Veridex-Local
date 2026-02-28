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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateJobPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [priorities, setPriorities] = useState({
    backendWeight: "important",
    consistencyWeight: "important",
    collaborationWeight: "optional",
    recencyWeight: "important",
    impactWeight: "important",
  })
  const [cgpaThreshold, setCgpaThreshold] = useState("7.0")
  const [cgpaCondition, setCgpaCondition] = useState("above")
  const [minThreshold, setMinThreshold] = useState(50)
  const [maxApplicants, setMaxApplicants] = useState("100")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    Object.entries(priorities).forEach(([key, value]) => {
      formData.set(key, value)
    })
    formData.set("cgpaThreshold", cgpaThreshold)
    formData.set("cgpaCondition", cgpaCondition)
    formData.set("minThreshold", minThreshold.toString())
    formData.set("maxApplicants", maxApplicants)

    const result = await createJobAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const priorityFields = [
    { key: "backendWeight" as const, label: "Backend / Complexity" },
    { key: "consistencyWeight" as const, label: "Consistency" },
    { key: "collaborationWeight" as const, label: "Collaboration" },
    { key: "recencyWeight" as const, label: "Recency" },
    { key: "impactWeight" as const, label: "Impact" },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Job</h1>
        <p className="text-muted-foreground">Define a job posting and set matching priorities</p>
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
            <div className="space-y-2">
              <Label htmlFor="maxApplicants" className="text-card-foreground">Max Applicants</Label>
              <Input
                id="maxApplicants"
                name="maxApplicants"
                type="number"
                min="1"
                value={maxApplicants}
                onChange={(e) => setMaxApplicants(e.target.value)}
                required
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Matching Priorities</CardTitle>
            <CardDescription>
              Assign a priority level to each dimension for candidate ranking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorityFields.map(({ key, label }) => (
              <div key={key} className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <Label className="text-card-foreground font-medium">{label}</Label>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {priorities[key] === "critical" ? "High" : priorities[key] === "important" ? "Medium" : "Low"}
                  </span>
                </div>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={2}
                    step={1}
                    value={[
                      priorities[key] === "critical" ? 2 : priorities[key] === "important" ? 1 : 0
                    ]}
                    onValueChange={([v]) => {
                      const val = v === 2 ? "critical" : v === 1 ? "important" : "optional"
                      setPriorities((prev) => ({ ...prev, [key]: val }))
                    }}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-tighter text-muted-foreground/60">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">CGPA Threshold Filter</CardTitle>
            <CardDescription>
              Exclude candidates based on CGPA requirement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Condition</Label>
                <Select value={cgpaCondition} onValueChange={setCgpaCondition}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above or Equal</SelectItem>
                    <SelectItem value="below">Below or Equal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-card-foreground">CGPA Value (0-10)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpaThreshold}
                  onChange={(e) => setCgpaThreshold(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Fit Score Threshold</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-card-foreground">Minimum Fit Score (%)</Label>
                <span className="text-sm font-mono text-muted-foreground">{minThreshold}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[minThreshold]}
                onValueChange={([v]) => setMinThreshold(v)}
              />
              <p className="text-xs text-muted-foreground">
                Candidates with a normalized fit score below this will be hidden.
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
