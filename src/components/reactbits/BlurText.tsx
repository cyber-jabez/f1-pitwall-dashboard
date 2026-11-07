import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            filter: 'blur(10px)',
            transform: direction === 'top' ? 'translateY(-15px)' : 'translateY(15px)'
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  filter: 'blur(0px)',
                  transform: 'translateY(0px)'
                }
              : {}
          }
          transition={{
            duration: 0.45,
            delay: (i * delay) / 1000,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block mr-[0.25em] will-change-[filter,transform,opacity]"
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </p>
  )
}

export default BlurText

