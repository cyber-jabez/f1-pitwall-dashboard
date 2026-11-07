import React, { useRef, useEffect, useState } from 'react'
import './LogoLoop.css'

export interface LogoLoopItem {
  id?: string | number
  label?: string
  subtitle?: string
  icon?: React.ReactNode
  badge?: string
}

export interface LogoLoopProps {
  items: LogoLoopItem[]
  speed?: number
  direction?: 'left' | 'right'
  gap?: number
  pauseOnHover?: boolean
  className?: string
  renderItem?: (item: LogoLoopItem, index: number) => React.ReactNode
}

export const LogoLoop: React.FC<LogoLoopProps> = ({
  items,
  speed = 40,
  direction = 'left',
  gap = 40,
  pauseOnHover = true,
  className = '',
  renderItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const singleWidthRef = useRef<number>(0)

  // Duplicate items 4 times to ensure seamless infinite looping
  const displayItems = [...items, ...items, ...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Calculate approximate width of one set of items
    const updateWidth = () => {
      if (track) {
        singleWidthRef.current = track.scrollWidth / 4
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime
      const delta = (currentTime - lastTimeRef.current) / 1000
      lastTimeRef.current = currentTime

      if (!isHovered || !pauseOnHover) {
        const move = speed * delta * (direction === 'left' ? 1 : -1)
        setOffset((prev) => {
          const single = singleWidthRef.current || 1000
          let next = prev + move
          if (next >= single) {
            next -= single
          } else if (next < 0) {
            next += single
          }
          return next
        })
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('resize', updateWidth)
    }
  }, [speed, direction, isHovered, pauseOnHover, items])

  return (
    <div
      ref={containerRef}
      className={`logoloop ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--logoloop-gap': `${gap}px` } as React.CSSProperties}
    >
      <div className="logoloop-fade-left" />
      <div className="logoloop-fade-right" />

      <div
        ref={trackRef}
        className="logoloop__track"
        style={{
          transform: `translate3d(-${offset}px, 0, 0)`,
        }}
      >
        <ul className="logoloop__list">
          {displayItems.map((item, idx) => (
            <li key={idx} className="logoloop__item">
              {renderItem ? (
                renderItem(item, idx)
              ) : (
                <div className="logoloop__content px-4 py-2 bg-[#0F1117] border border-ferrari-border/70 rounded-xl hover:border-ferrari-red/60 transition-colors">
                  {item.icon && <span className="text-ferrari-yellow">{item.icon}</span>}
                  <div className="flex flex-col">
                    <span className="font-display font-black text-sm tracking-wider text-white">
                      {item.label}
                    </span>
                    {item.subtitle && (
                      <span className="font-mono text-[10px] text-white/50 tracking-wider">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-[9px] font-mono font-bold bg-ferrari-red/20 text-ferrari-red border border-ferrari-red/30 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LogoLoop

