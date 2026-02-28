

import React, { Suspense } from 'react'
import Spline from '@splinetool/react-spline/next'

export function RolesBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Suspense fallback={null}>
                <Spline
                    scene="https://prod.spline.design/6Wpkhgq1pygSecX6/scene.splinecode"
                />
            </Suspense>
        </div>
    )
}
