"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, ExternalLink, ShieldCheck, Award } from "lucide-react"

interface LinkedInViewProps {
    url: string | null
    certificationsCount: number | null
}

export function LinkedInView({ url, certificationsCount }: LinkedInViewProps) {
    if (!url) {
        return (
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        LinkedIn Credibility
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">Link your LinkedIn profile to showcase certifications.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-card">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        LinkedIn Profile
                    </CardTitle>
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                    >
                        View <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 bg-muted/30 rounded-lg p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2]/10">
                        <Award className="h-5 w-5 text-[#0A66C2]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">{certificationsCount ?? 0} Certifications</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Verified Professional Growth</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verification Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">
                            Identity Verified
                        </Badge>
                        <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20">
                            Verified Experience
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
