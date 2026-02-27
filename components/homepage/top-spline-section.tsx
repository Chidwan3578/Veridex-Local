'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Use dynamic import to ensure it only loads on the client
const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
    ssr: false,
    loading: () => <div className="flex h-[500px] w-full items-center justify-center bg-background text-white/20 animate-pulse">Initializing 3D Text...</div>
})

export function TopSplineSection() {
    return (
        <section className="relative w-full h-[500px] bg-background overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <Suspense fallback={null}>
                    <Spline
                        scene="https://prod.spline.design/MyEMxEldUFdiGE7D/scene.splinecode"
                    />
                </Suspense>
            </div>
        </section>
    )
}
