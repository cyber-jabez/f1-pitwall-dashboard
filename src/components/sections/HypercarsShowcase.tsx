import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Shield, Zap, Sparkles, ChevronRight, X, Compass, Cpu, Gauge } from 'lucide-react'
import SpotlightCard from '../reactbits/SpotlightCard'
import ShinyText from '../reactbits/ShinyText'
import DecryptedText from '../reactbits/DecryptedText'

interface Hypercar {
  id: string
  name: string
  year: string
  power: string
  engine: string
  topSpeed: string
  acceleration: string
  tagline: string
  description: string
  heroImage: string
  accentColor: string
  specs: {
    displacement: string
    gearbox: string
    weight: string
    downforce: string
  }
}

const HYPERCARS: Hypercar[] = [
  {
    id: 'f80',
    name: 'Ferrari F80',
    year: '2025 // FLAGSHIP',
    power: '1,200 CV',
    engine: '3.0L 120° Twin-Turbo V6 Hybrid + 800V Tri-Motor',
    topSpeed: '350 KM/H',
    acceleration: '2.15s (0-100)',
    tagline: 'The Definitive Expression of Modern Hypercar Architecture',
    description:
      'The crown jewel of Maranello engineering. F1-derived electric turbochargers (e-turbo), active suspension with 48V actuators, and ground effect tunnels producing 1,050 kg of downforce.',
    heroImage: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#FF2800',
    specs: {
      displacement: '2,992 cc',
      gearbox: '8-Speed Dual Clutch F1',
      weight: '1,525 kg (Dry)',
      downforce: '1,050 kg @ 250 km/h'
    }
  },
  {
    id: 'daytona-sp3',
    name: 'Daytona SP3',
    year: '2023 // ICONA',
    power: '840 CV',
    engine: '6.5L Naturally Aspirated V12 @ 9,500 RPM',
    topSpeed: '340+ KM/H',
    acceleration: '2.85s (0-100)',
    tagline: 'Naturally Aspirated Symphony Honoring 1967 Daytona 1-2-3 Finish',
    description:
      'A masterclass of pure analog soul. The most powerful internal combustion engine Ferrari has ever built for a road car, revving to 9,500 RPM with butterfly doors and rear horizontal blades.',
    heroImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#FED500',
    specs: {
      displacement: '6,496 cc',
      gearbox: '7-Speed F1 Dual-Clutch',
      weight: '1,485 kg (Dry)',
      downforce: '500 kg @ 200 km/h'
    }
  },
  {
    id: '499p',
    name: 'Ferrari 499P',
    year: '2023-2024 // WEC LE MANS',
    power: '680 CV + 272 CV',
    engine: 'Twin-Turbo V6 Hybrid + Front MGU-K',
    topSpeed: '345 KM/H',
    acceleration: 'Race Optimized',
    tagline: 'Consecutive 24 Hours of Le Mans Champion (Centenary & 2024)',
    description:
      'Ferrari returned to the top tier of endurance racing after 50 years and took back-to-back historic triumphs at Circuit de la Sarthe against Porsche, Toyota, and Cadillac.',
    heroImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#FF2800',
    specs: {
      displacement: '2,994 cc',
      gearbox: '7-Speed Sequential Xtrac',
      weight: '1,030 kg (FIA Minimum)',
      downforce: 'FIA Hypercar Aero Spec'
    }
  },
  {
    id: 'laferrari',
    name: 'LaFerrari',
    year: '2013 // HY-KERS',
    power: '963 CV',
    engine: '6.3L V12 + 120 kW Electric Motor (HY-KERS)',
    topSpeed: '352 KM/H',
    acceleration: '2.9s (0-100)',
    tagline: 'The Holy Trinity Pioneer that Redefined the Hypercar',
    description:
      'Ferrari’s first hybrid hypercar combining an 800 CV atmospheric V12 with a Formula 1 KERS system to deliver instantaneous electric torque fill across the rev band.',
    heroImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#FF2800',
    specs: {
      displacement: '6,262 cc',
      gearbox: '7-Speed Dual Clutch',
      weight: '1,585 kg',
      downforce: 'Active Aero Flaps'
    }
  },
  {
    id: 'enzo',
    name: 'Ferrari Enzo',
    year: '2002 // COMMENDATORE',
    power: '660 CV',
    engine: '6.0L Tipo F140B V12',
    topSpeed: '355 KM/H',
    acceleration: '3.14s (0-100)',
    tagline: 'Bearing the Sacred Name of Il Commendatore',
    description:
      'Engineered directly from Michael Schumacher’s world championship Formula 1 car. Carbon-fiber monocoque, Brembo carbon-ceramic brakes, and active pushrod dampers.',
    heroImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#FED500',
    specs: {
      displacement: '5,998 cc',
      gearbox: '6-Speed F1 Automated Manual',
      weight: '1,370 kg',
      downforce: '775 kg @ 300 km/h'
    }
  },
  {
    id: 'f40',
    name: 'Ferrari F40',
    year: '1987 // RAW PURITY',
    power: '478 CV',
    engine: '2.9L Twin-Turbocharged Tipo F120A V8',
    topSpeed: '324 KM/H (201 MPH)',
    acceleration: '3.8s (0-100)',
    tagline: 'The Final Masterpiece Personally Blessed by Enzo Ferrari',
    description:
      'No power steering, no ABS, no electronic nannies. Kevlar and carbon body, green glue visible through the resin, and twin IHI turbos that kick like a raging stallion.',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#FF2800',
    specs: {
      displacement: '2,936 cc',
      gearbox: '5-Speed Gated Manual',
      weight: '1,250 kg',
      downforce: 'Fixed Kevlar Wing'
    }
  }
]

export const HypercarsShowcase: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<Hypercar | null>(null)

  return (
    <section id="hypercars" className="relative py-24 bg-[#07080C] overflow-hidden border-t border-ferrari-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/30 mb-3">
            <Flame className="w-3.5 h-3.5 text-ferrari-red" />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
              MARANELLO HALL OF IMMORTALS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-wider text-white uppercase mb-3">
            FLAGSHIPS & <ShinyText text="RACE LEGENDS" color="#FED500" shineColor="#FFFFFF" />
          </h2>

          <p className="max-w-2xl text-white/60 font-sans text-sm sm:text-base">
            Every hypercar in this pantheon revolutionized automotive physics. Hover to direct dynamic spotlights across carbon fiber bodywork.
          </p>
        </div>

        {/* Hypercars Grid powered by ReactBits SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HYPERCARS.map(car => (
            <SpotlightCard
              key={car.id}
              spotlightColor="rgba(255, 40, 0, 0.28)"
              size={380}
              className="flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedCar(car)}
            >
              <div>
                {/* Top Badge & Year */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-ferrari-yellow font-bold uppercase px-2.5 py-1 rounded bg-ferrari-yellow/10 border border-ferrari-yellow/20">
                    {car.year}
                  </span>
                  <span className="text-xs font-mono font-bold text-white/50">{car.power}</span>
                </div>

                {/* Car Name & Tagline */}
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-wide group-hover:text-ferrari-red transition-colors mb-2">
                  {car.name}
                </h3>
                <p className="text-xs font-sans text-white/60 line-clamp-2 mb-6">
                  {car.tagline}
                </p>

                {/* Specs Pill Matrix */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-ferrari-dark/80 border border-ferrari-border/60 mb-6 font-mono">
                  <div>
                    <span className="text-[9px] text-white/40 uppercase block">MAX OUTPUT</span>
                    <span className="text-sm font-bold text-ferrari-yellow">{car.power}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase block">TOP SPEED</span>
                    <span className="text-sm font-bold text-white">{car.topSpeed}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase block">0-100 KM/H</span>
                    <span className="text-sm font-bold text-emerald-400">{car.acceleration}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase block">POWERTRAIN</span>
                    <span className="text-[10px] font-bold text-white/80 truncate block">{car.engine.split('+')[0]}</span>
                  </div>
                </div>
              </div>

              {/* View Blueprint / Telemetry Link */}
              <div className="flex items-center justify-between pt-4 border-t border-ferrari-border/50 text-xs font-mono text-white/70 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-ferrari-red" />
                  <span>VIEW BLUEPRINT & TELEMETRY</span>
                </span>
                <ChevronRight className="w-4 h-4 text-ferrari-red transition-transform group-hover:translate-x-1" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Blueprint / Detailed Modal */}
      <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#0F1117] border border-ferrari-red/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(255,40,0,0.3)] max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCar(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-ferrari-red animate-ping" />
                <span className="text-xs font-mono text-ferrari-yellow tracking-widest uppercase">
                  {selectedCar.year} // SCHEMATICS
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-display font-black text-white uppercase mb-2">
                {selectedCar.name}
              </h3>
              <p className="text-sm font-sans text-ferrari-red font-medium mb-6">
                {selectedCar.tagline}
              </p>

              <p className="text-sm font-sans text-white/80 leading-relaxed mb-8">
                {selectedCar.description}
              </p>

              {/* Detailed Spec Sheet */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-black/60 border border-ferrari-border mb-8 font-mono">
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">DISPLACEMENT</span>
                  <span className="text-sm font-bold text-white">{selectedCar.specs.displacement}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">TRANSMISSION</span>
                  <span className="text-sm font-bold text-white">{selectedCar.specs.gearbox}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">CURB WEIGHT</span>
                  <span className="text-sm font-bold text-white">{selectedCar.specs.weight}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">DOWNFORCE LOAD</span>
                  <span className="text-sm font-bold text-ferrari-yellow">{selectedCar.specs.downforce}</span>
                </div>
              </div>

              {/* Decrypted Telemetry Note */}
              <div className="p-4 rounded-xl bg-ferrari-red/10 border border-ferrari-red/30 flex items-start gap-3">
                <Shield className="w-5 h-5 text-ferrari-red shrink-0 mt-0.5" />
                <div className="text-xs font-mono">
                  <span className="text-white/60 block mb-1">CORSE CLIENTI CERTIFICATION:</span>
                  <span className="text-white font-bold">
                    <DecryptedText text="MARANELLO ARCHIVE SERIAL // MONZA HOMOLOGATED" speed={25} />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HypercarsShowcase

