"use client"

import { useState, useTransition } from "react"
import { getSession } from "@/lib/auth"
import { updateResumeAction } from "@/lib/profile-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ResumePageProps {
    initialResume: string | null
    skills: { name: string; score: number }[]
}

const COMMON_TECH_KEYWORDS = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express", "Next.js", "Vue", "Angular",
    "Java", "Spring Boot", "Kotlin", "Swift", "Go", "Rust", "C++", "C#", ".NET",
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch", "SQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD",
    "Machine Learning", "Data Science", "AI", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn",
    "HTML", "CSS", "Sass", "Tailwind", "REST API", "GraphQL", "gRPC"
]

export function CandidateResumeUI({ initialResume, skills }: ResumePageProps) {
    const [resumeText, setResumeText] = useState(initialResume || "")
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateResumeAction(resumeText)
                toast({
                    title: "Resume analyzed",
                    description: "Technical keywords detected and prepared for recruiter review.",
                })
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to update resume. Please try again.",
                    variant: "destructive",
                })
            }
        })
    }

    // Detect skills from profile + common tech keywords
    const profileSkillsDetected = skills.filter(skill =>
        resumeText.toLowerCase().includes(skill.name.toLowerCase())
    ).map(s => s.name)

    const otherSkillsDetected = COMMON_TECH_KEYWORDS.filter(keyword =>
        resumeText.toLowerCase().includes(keyword.toLowerCase()) &&
        !profileSkillsDetected.some(p => p.toLowerCase() === keyword.toLowerCase())
    )

    const allDetectedSkills = [...profileSkillsDetected, ...otherSkillsDetected]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground">Resume Analysis</h1>
                <p className="text-muted-foreground">Analyze your professional documentation against your technical profile</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Resume Content
                        </CardTitle>
                        <CardDescription>
                            Paste your resume text below. We'll identify the technical skills mentioned and prepare them for recruiter verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste your professional summary, experience, and skills here..."
                            className="min-h-[400px] font-mono text-sm leading-relaxed"
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter className="justify-between border-t p-6">
                        <p className="text-xs text-muted-foreground italic">
                            * Detected skills are automatically flagged for recruiter review.
                        </p>
                        <Button onClick={handleSave} disabled={isPending || !resumeText.trim()}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Save & Analyze"
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Skills Detected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allDetectedSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {allDetectedSkills.map((skillName: string) => (
                                        <Badge key={skillName} variant="secondary" className="gap-1 py-1">
                                            {skillName}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-balance text-muted-foreground italic">
                                    Skills from your profile will appear here once detected in your resume.
                                </p>
                            )}
                            {resumeText && allDetectedSkills.length === 0 && (
                                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed border-border flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-muted-foreground leading-tight">
                                        No matching skills found from your technical profile. Ensure your resume contains keywords like: {skills.slice(0, 3).map(s => s.name).join(", ")}.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/[0.02] border-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary/60">Verification Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Recruiters will see a <strong>"Verified"</strong> badge next to these skills in your match reports, cross-referencing your resume claims with your GitHub activity.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
