'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 250 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive =
                target.closest('button') ||
                target.closest('a') ||
                target.closest('.pointer-events-auto') ||
                window.getComputedStyle(target).cursor === 'pointer'

            setIsHovering(!!isInteractive)
        }

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [cursorX, cursorY, isVisible])

    if (typeof window === 'undefined') return null

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0
                }}
            />

            {/* Ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full border border-white/40 bg-white/5 backdrop-blur-[2px]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: isHovering ? 60 : 32,
                    height: isHovering ? 60 : 32,
                    opacity: isVisible ? 1 : 0
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 200,
                    mass: 0.5
                }}
            />
        </div>
    )
}
