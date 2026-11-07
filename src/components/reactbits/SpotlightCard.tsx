import React, { useRef, useState, useEffect } from 'react'
import './SpotlightCard.css'

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string
  intensity?: number
  size?: number
  children: React.ReactNode
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  spotlightColor = 'rgba(255, 40, 0, 0.22)',
  intensity = 1,
  size = 350,
  children,
  className = '',
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCoords({ x, y })
    if (lightRef.current) {
      lightRef.current.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
      style={style}
      {...props}
    >
      <span ref={lightRef} className="spotlight-card__light" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default SpotlightCard

