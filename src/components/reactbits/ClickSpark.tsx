import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type ClickSparkShape = 'line' | 'streak' | 'dot' | 'star'

export interface ClickSparkProps {
  sparkColor?: string | string[]
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  sparkWidth?: number
  duration?: number
  shape?: ClickSparkShape
  randomness?: number
  gravity?: number
  spread?: number
  direction?: number
  glow?: number
  ring?: boolean
  layer?: 'front' | 'back'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface ClickSparkHandle {
  spark: (x?: number, y?: number) => void
}

interface Spark {
  angle: number
  reach: number
  scale: number
  life: number
  spin: number
  color: string
  clear: string
  glow: number
}

interface Burst {
  x: number
  y: number
  start: number
  sparks: Spark[]
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ratio: number
  left: number
  top: number
}

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))

const toColors = (value: string | string[]): string[] => {
  const list = (Array.isArray(value) ? value : [value]).filter(Boolean)
  return list.length ? list : ['#FF2800', '#FED500', '#FFFFFF']
}

const channels = (ctx: CanvasRenderingContext2D, color: string): [number, number, number] => {
  ctx.fillStyle = color
  const normal = String(ctx.fillStyle)
  const hex = /^#([0-9a-f]{6})$/i.exec(normal)
  if (hex) {
    const value = parseInt(hex[1], 16)
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
  }
  return [255, 40, 0]
}

export const ClickSpark = forwardRef<ClickSparkHandle, ClickSparkProps>(
  (
    {
      sparkColor = ['#FF2800', '#FED500', '#FFF', '#E5A91E'],
      sparkSize = 16,
      sparkRadius = 38,
      sparkCount = 14,
      sparkWidth = 2.5,
      duration = 550,
      shape = 'streak',
      randomness = 0.35,
      gravity = 120,
      spread = 360,
      direction = 0,
      glow = 0.8,
      ring = true,
      layer = 'front',
      disabled = false,
      className = '',
      style,
      children
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const layerRef = useRef<HTMLSpanElement>(null)
    const engineRef = useRef<ClickSparkHandle | null>(null)

    useEffect(() => {
      const root = rootRef.current
      const layerElem = layerRef.current
      if (!root || !layerElem) return

      const bursts: Burst[] = []
      let raf = 0

      const drawSpark = (ctx: CanvasRenderingContext2D, burst: Burst, spark: Spark, elapsed: number) => {
        const life = duration * spark.life
        const p = elapsed / life
        if (p >= 1) return false
        const e = 1 - Math.pow(1 - p, 3)
        const seconds = elapsed / 1000
        const distance = sparkRadius * spark.reach * e
        const width = sparkWidth * spark.scale
        const fade = 1 - p * p
        if (fade <= 0) return true

        const x1 = burst.x + Math.cos(spark.angle) * distance
        const y1 = burst.y + Math.sin(spark.angle) * distance + 0.5 * gravity * seconds * seconds
        const length = sparkSize * spark.scale * Math.pow(1 - p, 1.4)
        const x2 = x1 + Math.cos(spark.angle) * length
        const y2 = y1 + Math.sin(spark.angle) * length

        ctx.strokeStyle = spark.color
        ctx.lineCap = 'round'
        if (spark.glow > 0) {
          ctx.globalAlpha = fade * 0.35 * spark.glow
          ctx.lineWidth = width * 3.5
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        ctx.globalAlpha = fade
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return true
      }

      const drawRing = (ctx: CanvasRenderingContext2D, burst: Burst, elapsed: number) => {
        const p = elapsed / (duration * 0.7)
        if (p >= 1) return false
        const radius = 3 + sparkRadius * 0.7 * (1 - Math.pow(1 - p, 3))
        ctx.globalAlpha = Math.pow(1 - p, 2) * 0.6
        ctx.strokeStyle = burst.sparks[0]?.color ?? '#FED500'
        ctx.lineWidth = Math.max(0.5, sparkWidth * (1 - p))
        ctx.beginPath()
        ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2)
        ctx.stroke()
        return true
      }

      const frame = (now: number) => {
        raf = 0
        for (const burst of [...bursts]) {
          const elapsed = now - burst.start
          const ctx = burst.ctx
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.clearRect(0, 0, burst.canvas.width, burst.canvas.height)
          ctx.setTransform(burst.ratio, 0, 0, burst.ratio, -burst.left * burst.ratio, -burst.top * burst.ratio)
          let alive = false
          if (ring && drawRing(ctx, burst, elapsed)) alive = true
          for (const spark of burst.sparks) {
            if (drawSpark(ctx, burst, spark, elapsed)) alive = true
          }
          ctx.globalAlpha = 1
          if (!alive) {
            burst.canvas.remove()
            const idx = bursts.indexOf(burst)
            if (idx >= 0) bursts.splice(idx, 1)
          }
        }
        if (bursts.length) raf = requestAnimationFrame(frame)
      }

      const spawn = (clientX: number, clientY: number) => {
        if (disabled) return
        const rect = root.getBoundingClientRect()
        const colors = toColors(sparkColor)
        const sparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => {
          const baseAngle = ((direction - 90) * Math.PI) / 180 + ((Math.PI * 2) / sparkCount) * i
          const jitter = (Math.random() - 0.5) * randomness
          const color = colors[i % colors.length]
          return {
            angle: baseAngle + jitter,
            reach: 1 + (Math.random() - 0.5) * 0.6 * randomness,
            scale: 1 + (Math.random() - 0.5) * 0.7 * randomness,
            life: 0.9 + Math.random() * 0.3,
            spin: Math.random() - 0.5,
            color,
            clear: 'transparent',
            glow
          }
        })

        const reach = sparkRadius * 1.5 + sparkSize + 10
        const box = {
          left: Math.max(clientX - reach, 0),
          top: Math.max(clientY - reach, 0),
          right: Math.min(clientX + reach, window.innerWidth),
          bottom: Math.min(clientY + reach + 100, window.innerHeight)
        }
        if (box.right - box.left < 1 || box.bottom - box.top < 1) return

        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        const canvas = document.createElement('canvas')
        canvas.width = Math.ceil((box.right - box.left) * ratio)
        canvas.height = Math.ceil((box.bottom - box.top) * ratio)
        Object.assign(canvas.style, {
          position: 'absolute',
          left: `${box.left - rect.left}px`,
          top: `${box.top - rect.top}px`,
          width: `${box.right - box.left}px`,
          height: `${box.bottom - box.top}px`,
          display: 'block',
          pointerEvents: 'none'
        })
        layerElem.appendChild(canvas)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          canvas.remove()
          return
        }

        bursts.push({
          x: clientX,
          y: clientY,
          start: performance.now(),
          sparks,
          canvas,
          ctx,
          ratio,
          left: box.left,
          top: box.top
        })
        while (bursts.length > 20) {
          const b = bursts.shift()
          b?.canvas.remove()
        }
        if (!raf) raf = requestAnimationFrame(frame)
      }

      const onPointerDown = (event: PointerEvent) => {
        spawn(event.clientX, event.clientY)
      }

      root.addEventListener('pointerdown', onPointerDown)
      engineRef.current = {
        spark: (x, y) => {
          const r = root.getBoundingClientRect()
          spawn(r.left + (x ?? r.width / 2), r.top + (y ?? r.height / 2))
        }
      }

      return () => {
        cancelAnimationFrame(raf)
        root.removeEventListener('pointerdown', onPointerDown)
        for (const b of bursts) b.canvas.remove()
        engineRef.current = null
      }
    }, [direction, disabled, duration, glow, gravity, ring, shape, sparkColor, sparkCount, sparkRadius, sparkSize, sparkWidth, randomness])

    useImperativeHandle(ref, () => ({
      spark: (x, y) => engineRef.current?.spark(x, y)
    }))

    return (
      <div
        ref={rootRef}
        className={`relative w-full h-full isolate ${className}`}
        style={style}
      >
        {children}
        <span
          ref={layerRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{ zIndex: layer === 'back' ? -1 : 50 }}
        />
      </div>
    )
  }
)

ClickSpark.displayName = 'ClickSpark'
export default ClickSpark

