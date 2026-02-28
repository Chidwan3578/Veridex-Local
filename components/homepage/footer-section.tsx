import Link from "next/link"
import { Shield } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="relative z-50 border-t border-border/50 bg-background px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Shield className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Veridex
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Sign In
          </Link>
          <Link href="/signup" className="transition-colors hover:text-foreground">
            Sign Up
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          Hiring Intelligence Platform
        </p>
      </div>
    </footer>
  )
}
