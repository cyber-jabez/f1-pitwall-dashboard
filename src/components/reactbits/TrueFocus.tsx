import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export interface TrueFocusProps {
  sentence?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  className?: string
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'ESSERE FERRARI FOREVER',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#FF2800',
  glowColor = 'rgba(255, 40, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.2,
  className = ''
}) => {
  const words = sentence.split(' ')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [focusRect, setFocusRect] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % words.length)
      }, (animationDuration + pauseBetweenAnimations) * 1000)
      return () => clearInterval(interval)
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length])

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return
    if (!wordRefs.current[currentIndex] || !containerRef.current) return

    const parentRect = containerRef.current.getBoundingClientRect()
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    })
  }, [currentIndex, words.length])

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none ${className}`}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex
        return (
          <span
            key={index}
            ref={el => { wordRefs.current[index] = el }}
            onClick={() => manualMode && setCurrentIndex(index)}
            className="relative cursor-pointer transition-all duration-300 font-display font-black tracking-wider uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white"
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.4
            }}
          >
            {word}
          </span>
        )
      })}

      <motion.div
        className="absolute pointer-events-none rounded-lg"
        animate={{
          x: focusRect.x - 6,
          y: focusRect.y - 4,
          width: focusRect.width + 12,
          height: focusRect.height + 8,
          opacity: focusRect.width > 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration,
          ease: [0.25, 1, 0.5, 1]
        }}
        style={{
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 15px ${glowColor}, inset 0 0 10px ${glowColor}`
        }}
      >
        <span
          className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2"
          style={{ borderColor: '#FED500' }}
        />
        <span
          className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2"
          style={{ borderColor: '#FED500' }}
        />
        <span
          className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2"
          style={{ borderColor: '#FED500' }}
        />
        <span
          className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2"
          style={{ borderColor: '#FED500' }}
        />
      </motion.div>
    </div>
  )
}

export default TrueFocus

