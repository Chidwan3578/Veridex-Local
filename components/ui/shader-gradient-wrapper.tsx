'use client'

import React, { Suspense } from 'react'
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'

export function ShaderGradientWrapper() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <ShaderGradientCanvas
                style={{
                    width: '100vw',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                }}
            >
                <Suspense fallback={null}>
                    <ShaderGradient
                        {...({
                            animate: 'on',
                            axesHelper: 'off',
                            brightness: 1.2,
                            cAzimuthAngle: 170,
                            cDistance: 4.4,
                            cPolarAngle: 70,
                            cameraZoom: 1,
                            color1: '#00006b',
                            color2: '#5a0eab',
                            color3: '#0a1349',
                            destination: 'onCanvas',
                            embedMode: 'off',
                            envPreset: 'city',
                            format: 'gif',
                            fov: 45,
                            frameRate: 10,
                            gizmoHelper: 'hide',
                            grain: 'off',
                            lightType: '3d',
                            pixelDensity: 1,
                            positionX: 0,
                            positionY: 0.9,
                            positionZ: -0.3,
                            range: 'disabled',
                            rangeEnd: 40,
                            rangeStart: 0,
                            reflection: 0.1,
                            rotationX: 45,
                            rotationY: 0,
                            rotationZ: 0,
                            shader: 'defaults',
                            type: 'waterPlane',
                            uAmplitude: 0,
                            uDensity: 1.2,
                            uFrequency: 0,
                            uSpeed: 0.2,
                            uStrength: 3.4,
                            uTime: 0,
                            wireframe: false,
                        } as any)}
                    />
                </Suspense>
            </ShaderGradientCanvas>
        </div>
    )
}
