declare module 'hls.js' {
  const Hls: any
  export default Hls
}

declare module 'framer-motion' {
  export const motion: any
  export const AnimatePresence: any
  export const animate: any
  export const useInView: any
  export type MotionProps = any
  export type HTMLMotionProps<T> = any
}

declare module 'canvas-confetti' {
  const confetti: any
  export default confetti
}

declare module 'three' {
  const three: any
  export = three
}

declare namespace THREE {
  export type Scene = any
  export type Mesh = any
  export type Group = any
  export type SpotLight = any
  export type PerspectiveCamera = any
  export type MeshStandardMaterial = any
  export type MeshPhysicalMaterial = any
  export type BufferGeometry = any
  export type Vector3 = any
  export type IUniform = any
  export type ShaderMaterialParameters = any
  export type InstancedBufferGeometry = any
  export type InstancedBufferAttribute = any
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export class OrbitControls {
    constructor(camera: any, domElement: any)
    enableDamping: boolean
    dampingFactor: number
    maxPolarAngle: number
    minDistance: number
    maxDistance: number
    autoRotate: boolean
    autoRotateSpeed: number
    update(): void
    dispose(): void
  }
}

declare module 'three/*' {
  const content: any
  export = content
}

declare module 'lucide-react' {
  import * as React from 'react'

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >

  export const Pause: LucideIcon
  export const Volume2: LucideIcon
  export const VolumeX: LucideIcon
  export const Sparkles: LucideIcon
  export const Gauge: LucideIcon
  export const Zap: LucideIcon
  export const Flame: LucideIcon
  export const ShieldAlert: LucideIcon
  export const Flag: LucideIcon
  export const Compass: LucideIcon
  export const Trophy: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronRight: LucideIcon
  export const Radio: LucideIcon
  export const Palette: LucideIcon
  export const Shield: LucideIcon
  export const Disc: LucideIcon
  export const Wrench: LucideIcon
  export const Play: LucideIcon
  export const CheckCircle2: LucideIcon
  export const RotateCcw: LucideIcon
  export const Lightbulb: LucideIcon
  export const Wind: LucideIcon
  export const Eye: LucideIcon
  export const AlertTriangle: LucideIcon
  export const Timer: LucideIcon
  export const AlertCircle: LucideIcon
  export const Cpu: LucideIcon
  export const X: LucideIcon
  export const Activity: LucideIcon
  export const BatteryCharging: LucideIcon
  export const MapPin: LucideIcon
  export const Heart: LucideIcon
  export const Award: LucideIcon
  export const User: LucideIcon
  export const ShieldCheck: LucideIcon
  export const Download: LucideIcon
  export const ArrowUp: LucideIcon
  export const Headphones: LucideIcon
  export const Sliders: LucideIcon
  export const ChevronLeft: LucideIcon
  export const Share2: LucideIcon
  export const Maximize2: LucideIcon
  export const Search: LucideIcon
  export const Calendar: LucideIcon
  export const Tv: LucideIcon
  export const BookOpen: LucideIcon
  export const ImageIcon: LucideIcon
  export const Users: LucideIcon
  export const Layers: LucideIcon
  export const Filter: LucideIcon
  export const ExternalLink: LucideIcon
  export const RefreshCw: LucideIcon
  export const Settings: LucideIcon
  export const TrendingUp: LucideIcon
  export const FileText: LucideIcon
  export const Check: LucideIcon
  export const Grid: LucideIcon
  export const List: LucideIcon
  export const BarChart3: LucideIcon
  export const Clock: LucideIcon
  export const ChevronUp: LucideIcon
  export const HelpCircle: LucideIcon
  export const SlidersHorizontal: LucideIcon
  export const Car: LucideIcon
  export const Plus: LucideIcon
  export const Trash2: LucideIcon
  export const MessageSquare: LucideIcon
  export const FastForward: LucideIcon
  export const Minimize2: LucideIcon
  export const Power: LucideIcon
  export const Star: LucideIcon
  export const Key: LucideIcon
  export const EyeOff: LucideIcon

  const allIcons: Record<string, LucideIcon>
  export default allIcons
}
