'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// Use dynamic import to ensure it only loads on the client
const Spline = dynamic(() => import('@splinetool/react-spline'), {
    ssr: false,
    loading: () => <div className="text-white/20 animate-pulse">Initializing 3D...</div>
})

interface SplineBackgroundProps {
    className?: string
}

export function SplineSection({ className }: SplineBackgroundProps) {
    return (
        <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] md:w-[1600px] md:h-[1600px] opacity-80">
                <Suspense fallback={null}>
                    <Spline
                        scene="https://prod.spline.design/qYckqqAECNbPvv3m/scene.splinecode"
                        style={{ width: '100%', height: '100%' }}
                    />
                </Suspense>
            </div>
        </div>
    )
}
