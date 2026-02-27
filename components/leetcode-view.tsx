"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code2, Trophy, Target, Award } from "lucide-react"

interface LeetCodeViewProps {
    username: string | null
    score: number | null
    rank: number | null
}

export function LeetCodeView({ username, score, rank }: LeetCodeViewProps) {
    if (!username) {
        return (
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        LeetCode Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">Connect your LeetCode account to show performance metrics.</p>
                </CardContent>
            </Card>
        )
    }

    // Assuming max score of 3000 for progress bar
    const progressValue = score ? Math.min((score / 3000) * 100, 100) : 0

    return (
        <Card className="bg-card">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        LeetCode Summary
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{username}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/30 rounded-lg p-3">
                        <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <p className="text-[10px] text-muted-foreground uppercase">Score</p>
                        <p className="text-lg font-bold">{score ?? 0}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                        <Award className="h-4 w-4 mx-auto mb-1 text-accent" />
                        <p className="text-[10px] text-muted-foreground uppercase">Global Rank</p>
                        <p className="text-lg font-bold">{rank?.toLocaleString() ?? "N/A"}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Skill Tier</span>
                        <span className="font-medium">
                            {score && score > 2000 ? "Guardian" : score && score > 1800 ? "Knight" : "Competitive"}
                        </span>
                    </div>
                    <Progress value={progressValue} className="h-1.5" />
                </div>
            </CardContent>
        </Card>
    )
}
