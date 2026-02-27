"use client"

import { useState } from "react"
import Link from "next/link"
import { signupAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { VeridexLogo } from "@/components/veridex-logo"
import { AlertCircle, User, Briefcase } from "lucide-react"

export default function SignupPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    const result = await signupAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <VeridexLogo className="text-foreground" />
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join Veridex to start evaluating or showcasing talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
                <Input id="name" name="name" placeholder="Your name" required className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a password" required className="bg-background" />
              </div>

              <div className="space-y-3">
                <Label className="text-card-foreground">I am a...</Label>
                <RadioGroup name="role" defaultValue="candidate" className="grid grid-cols-2 gap-3">
                  <Label
                    htmlFor="role-candidate"
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value="candidate" id="role-candidate" className="sr-only" />
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-card-foreground">Candidate</span>
                  </Label>
                  <Label
                    htmlFor="role-recruiter"
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value="recruiter" id="role-recruiter" className="sr-only" />
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-card-foreground">Recruiter</span>
                  </Label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
