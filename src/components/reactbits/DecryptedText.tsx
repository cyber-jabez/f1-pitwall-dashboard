import React, { useEffect, useState, useRef } from 'react'

export interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  characters?: string
  className?: string
  encryptedClassName?: string
  animateOn?: 'view' | 'hover'
  revealDirection?: 'start' | 'end' | 'center'
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 12,
  characters = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ#$@*!',
  className = '',
  encryptedClassName = 'text-ferrari-yellow/70',
  animateOn = 'view'
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovered, setIsHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  const triggerAnimation = () => {
    let iteration = 0
    const chars = text.split('')
    const interval = setInterval(() => {
      setDisplayText(
        chars
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < (iteration / maxIterations) * chars.length) {
              return char
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      )

      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
      }
      iteration++
    }, speed)
  }

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            triggerAnimation()
          }
        },
        { threshold: 0.2 }
      )
      if (containerRef.current) observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [animateOn, hasAnimated, text])

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => {
        if (animateOn === 'hover') {
          setIsHovered(true)
          triggerAnimation()
        }
      }}
      className={`inline-block font-mono tracking-wider ${className}`}
    >
      {displayText}
    </span>
  )
}

export default DecryptedText

