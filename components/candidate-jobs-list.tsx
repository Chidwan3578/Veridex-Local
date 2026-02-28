"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Briefcase,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Target,
    ChevronRight,
    TrendingDown,
    Sparkles,
} from "lucide-react"

export interface JobRecommendation {
    id: string
    title: string
    description: string
    matchPercentage: number
    suitability: "Highly Suitable" | "Good Match" | "Moderate Match" | "Low Match"
    cgpaStatus: "PASS" | "FAIL"
    cgpaRequirement: string
    topPriorities: string[]
    applicantCount: number
    skillGaps: string[]
    isBestMatch: boolean
}

interface CandidateJobsListProps {
    jobs: JobRecommendation[]
}

export function CandidateJobsList({ jobs }: CandidateJobsListProps) {
    const [suitabilityFilter, setSuitabilityFilter] = useState<string>("all")
    const [above60Filter, setAbove60Filter] = useState(false)

    const filteredJobs = jobs.filter((job) => {
        if (above60Filter && job.matchPercentage < 60) return false
        if (suitabilityFilter !== "all" && job.suitability !== suitabilityFilter) return false
        return true
    })

    function getSuitabilityColor(suitability: string) {
        switch (suitability) {
            case "Highly Suitable":
                return "bg-accent/15 text-accent border-accent/30"
            case "Good Match":
                return "bg-chart-3/15 text-chart-3 border-chart-3/30"
            case "Moderate Match":
                return "bg-chart-4/15 text-chart-4 border-chart-4/30"
            default:
                return "bg-muted text-muted-foreground border-border"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="above-60"
                            checked={above60Filter}
                            onCheckedChange={setAbove60Filter}
                        />
                        <Label htmlFor="above-60" className="text-sm font-medium">
                            Above 60% Match
                        </Label>
                    </div>
                    <Select value={suitabilityFilter} onValueChange={setSuitabilityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Suitability" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Matches</SelectItem>
                            <SelectItem value="Highly Suitable">Highly Suitable</SelectItem>
                            <SelectItem value="Good Match">Good Match</SelectItem>
                            <SelectItem value="Moderate Match">Moderate Match</SelectItem>
                            <SelectItem value="Low Match">Low Match</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                    Showing {filteredJobs.length} of {jobs.length} recommended jobs
                </p>
            </div>

            <div className="grid gap-6">
                {filteredJobs.map((job) => (
                    <Card
                        key={job.id}
                        className={`relative overflow-hidden transition-all hover:shadow-md border-2 ${job.isBestMatch ? "border-primary/50" : "border-border/50"
                            }`}
                    >
                        {job.isBestMatch && (
                            <div className="absolute top-0 right-0 bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground flex items-center gap-1 rounded-bl-lg">
                                <Sparkles className="h-3 w-3" />
                                Best Match For You
                            </div>
                        )}
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between pr-24">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-xl">{job.title}</CardTitle>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                                        {job.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-primary">
                                        {job.matchPercentage.toFixed(0)}%
                                    </p>
                                    <div className="flex flex-col items-end gap-1 mt-1">
                                        <Badge variant="outline" className={`py-0.5 ${getSuitabilityColor(job.suitability)}`}>
                                            {job.suitability}
                                        </Badge>
                                        <Badge variant="secondary" className="text-[10px] py-0 px-2 h-5 bg-muted/50 border-none">
                                            {job.applicantCount} Applicants
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Requirements Status
                                        </h4>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">CGPA: {job.cgpaRequirement}</span>
                                            </div>
                                            {job.cgpaStatus === "PASS" ? (
                                                <Badge className="bg-accent/15 text-accent border-accent/20 hover:bg-accent/20">
                                                    PASSED
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20">
                                                    FAILED
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                            Top Job Priorities
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {job.topPriorities.map((p) => (
                                                <Badge key={p} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                                                    {p}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <TrendingDown className="h-3 w-3 text-destructive" />
                                        Skill Gap Analysis
                                    </h4>
                                    {job.skillGaps.length > 0 ? (
                                        <ul className="space-y-2">
                                            {job.skillGaps.map((gap, i) => (
                                                <li key={i} className="flex items-start gap-2 p-2 rounded-md bg-destructive/5 border border-destructive/10">
                                                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                                    <span className="text-sm text-card-foreground">{gap}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex items-center gap-2 p-3 rounded-md bg-accent/5 border border-accent/10">
                                            <CheckCircle2 className="h-4 w-4 text-accent" />
                                            <span className="text-sm text-accent font-medium">No critical gaps! Perfect for your profile.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-end">
                            <Button className="gap-2">
                                View Details <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="flex h-60 flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-12 text-center">
                    <Briefcase className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No matching jobs found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Try adjusting your filters or complete your profile to see more recommendations.
                    </p>
                </div>
            )}
        </div>
    )
}
