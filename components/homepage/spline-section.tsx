// Server Component
import Spline from '@splinetool/react-spline/next'
import { Suspense } from 'react'
import { cn } from '@/lib/utils'

interface SplineBackgroundProps {
    className?: string
}

export function SplineSection({ className }: SplineBackgroundProps) {
    return (
        <div className={cn("fixed inset-0 z-0 flex justify-center pointer-events-none", className)}>
            <div className="relative w-full max-w-[1200px] h-full overflow-hidden pointer-events-auto pt-24">
                <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-white/20 animate-pulse">Initializing 3D...</div>}>
                    <Spline
                        scene="https://prod.spline.design/h2msGHD5y-1HifYu/scene.splinecode"
                    />
                </Suspense>
            </div>
        </div>
    )
}
