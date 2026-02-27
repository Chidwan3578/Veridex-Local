import { Shield } from "lucide-react"

export function VeridexLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <Shield className="h-4.5 w-4.5 text-primary-foreground" />
      </div>
      <span className="text-lg font-bold tracking-tight">Veridex</span>
    </div>
  )
}
