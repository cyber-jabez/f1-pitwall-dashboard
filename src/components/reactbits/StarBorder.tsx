import React, { useEffect, useRef } from 'react'

export interface StarBorderProps {
  as?: React.ElementType
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = '#FED500',
  speed = '4s',
  thickness = 2,
  children,
  onClick,
  disabled = false,
  style,
  ...props
}) => {
  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-xl group select-none transition-all active:scale-95 ${className}`}
      style={style}
      {...props}
    >
      {/* Revolving Star Gradient Border */}
      <span
        className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, ${color} 330deg, #FFFFFF 360deg)`
        }}
      />
      {/* Inner surface */}
      <span className="relative z-10 w-full h-full flex items-center justify-center gap-2 rounded-[10px] bg-[#0E1017] px-5 py-2.5 transition-colors group-hover:bg-[#151824]">
        {children}
      </span>
    </Component>
  )
}

export default StarBorder

