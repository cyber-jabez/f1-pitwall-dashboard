import React, { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './ShinyText.css'

export interface ShinyTextProps {
  text?: string
  children?: ReactNode
  color?: string
  shineColor?: string
  speed?: number
  delay?: number
  angle?: number
  shineWidth?: number
  softness?: number
  glow?: number
  direction?: 'left' | 'right'
  className?: string
  style?: CSSProperties
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  children,
  color = '#FED500',
  shineColor = '#FFFFFF',
  speed = 3.5,
  delay = 0,
  angle = 120,
  shineWidth = 25,
  softness = 0.5,
  glow = 0.4,
  direction = 'left',
  className = '',
  style
}) => {
  const textRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = textRef.current
    const glowEl = glowRef.current
    if (!el) return

    let animId = 0
    let start = performance.now() + delay * 1000

    const update = (now: number) => {
      const elapsed = Math.max(0, (now - start) / 1000)
      const progress = (elapsed / speed) % 1
      const p = direction === 'left' ? progress : 1 - progress
      const center = p * (100 + shineWidth * 2) - shineWidth
      const c1 = `color-mix(in srgb, ${color} 100%, transparent)`
      const c2 = `color-mix(in srgb, ${shineColor} 100%, transparent)`
      const rad = (angle * Math.PI) / 180
      const grad = `linear-gradient(${angle}deg, ${c1} ${Math.max(0, center - shineWidth)}%, ${c2} ${center}%, ${c1} ${Math.min(100, center + shineWidth)}%)`

      el.style.backgroundImage = grad
      if (glowEl && glow > 0) {
        glowEl.style.backgroundImage = grad
        glowEl.style.opacity = `${glow}`
      }
      animId = requestAnimationFrame(update)
    }

    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [color, shineColor, speed, delay, angle, shineWidth, softness, glow, direction])

  const content = text ?? children

  return (
    <span ref={textRef} className={`shiny-text font-bold ${className}`} style={style}>
      {glow > 0 && <span ref={glowEl => { glowRef.current = glowEl }} className="shiny-text__glow" aria-hidden="true">{content}</span>}
      {content}
    </span>
  )
}

export default ShinyText
