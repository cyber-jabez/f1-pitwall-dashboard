import React, { useState, useRef } from 'react'
import ShinyText from '../reactbits/ShinyText'
import Magnet from '../reactbits/Magnet'
import { ShieldCheck, Download, Award, User, Sparkles, X, Share2 } from 'lucide-react'

interface TifosiPassportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TifosiPassportModal: React.FC<TifosiPassportModalProps> = ({ isOpen, onClose }) => {
  const [tifosiName, setTifosiName] = useState('ALEX DE MARANELLO')
  const [driverNum, setDriverNum] = useState('#16')
  const [memberTier, setMemberTier] = useState('CORSE CLIENTI VIP')
  const [circuit, setCircuit] = useState('AUTODROMO NAZIONALE MONZA')
  const [downloading, setDownloading] = useState(false)

  if (!isOpen) return null

  // Function to render the pass to high-res canvas and download as PNG
  const handleDownloadPass = () => {
    setDownloading(true)
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 750
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      setDownloading(false)
      return
    }

    // Background Dark Slate / Carbon
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750)
    bgGrad.addColorStop(0, '#0F121A')
    bgGrad.addColorStop(0.5, '#07080C')
    bgGrad.addColorStop(1, '#1A0404')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 1200, 750)

    // Outer Border with Golden Sheen
    ctx.strokeStyle = '#FED500'
    ctx.lineWidth = 6
    ctx.strokeRect(30, 30, 1140, 690)

    // Inner Red Border
    ctx.strokeStyle = '#FF2800'
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, 1120, 670)

    // Italian Tricolore Band Across Top
    ctx.fillStyle = '#008C45'
    ctx.fillRect(40, 40, 373, 14)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(413, 40, 374, 14)
    ctx.fillStyle = '#CD212A'
    ctx.fillRect(787, 40, 373, 14)

    // Header Title
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 38px "Space Grotesk", sans-serif'
    ctx.fillText('SCUDERIA FERRARI', 80, 120)

    ctx.fillStyle = '#FED500'
    ctx.font = 'bold 20px monospace'
    ctx.fillText('OFFICIAL TIFOSI PASSPORT // MARANELLO CORSE', 80, 155)

    // Scuderia Shield Cavallino Drawing
    ctx.save()
    ctx.translate(1000, 140)
    ctx.fillStyle = '#FED500'
    ctx.beginPath()
    ctx.moveTo(0, -60)
    ctx.lineTo(50, -40)
    ctx.lineTo(50, 40)
    ctx.lineTo(0, 80)
    ctx.lineTo(-50, 40)
    ctx.lineTo(-50, -40)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.stroke()
    // Shield letter 'SF'
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 28px monospace'
    ctx.fillText('SF', -18, 20)
    ctx.restore()

    // Horizontal Separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(80, 190)
    ctx.lineTo(1120, 190)
    ctx.stroke()

    // User Details Grid
    const drawField = (label: string, value: string, x: number, y: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '14px monospace'
      ctx.fillText(label.toUpperCase(), x, y)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 26px "Space Grotesk", sans-serif'
      ctx.fillText(value.toUpperCase(), x, y + 34)
    }

    drawField('Tifosi Member Name', tifosiName, 80, 240)
    drawField('Blood Type', '100% ROSSO CORSA', 650, 240)

    drawField('Membership Tier', memberTier, 80, 340)
    drawField('Fav Driver Number', `${driverNum} // SCUDERIA PILOTA`, 650, 340)

    drawField('Home Sanctuary', circuit, 80, 440)
    drawField('Maranello Passcode', 'SF-2026-PASS-9874', 650, 440)

    // Simulated Barcode at Bottom
    ctx.fillStyle = '#FED500'
    ctx.fillRect(80, 560, 400, 60)
    ctx.fillStyle = '#000000'
    for (let bx = 90; bx < 470; bx += Math.random() * 8 + 4) {
      ctx.fillRect(bx, 565, Math.random() * 4 + 1, 50)
    }

    // Official Stamp
    ctx.save()
    ctx.translate(950, 580)
    ctx.rotate(-0.15)
    ctx.strokeStyle = '#CD212A'
    ctx.lineWidth = 3
    ctx.strokeRect(-120, -35, 240, 70)
    ctx.fillStyle = '#CD212A'
    ctx.font = 'bold 16px monospace'
    ctx.fillText('VERIFIED TIFOSI', -75, -5)
    ctx.font = '11px monospace'
    ctx.fillText('MARANELLO FACTORY CREW', -85, 18)
    ctx.restore()

    // Export to Image & Trigger Download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Scuderia-Ferrari-Passport-${tifosiName.replace(/\s+/g, '_')}.png`
      link.href = dataUrl
      link.click()
      setDownloading(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D0F17] border-2 border-ferrari-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-ferrari-red text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-ferrari-red/20 border border-ferrari-red flex items-center justify-center">
            <Award className="w-5 h-5 text-ferrari-red" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white uppercase">
              GENERATE YOUR <ShinyText text="OFFICIAL TIFOSI PASSPORT" speed={2.5} className="text-ferrari-yellow" />
            </h3>
            <p className="font-mono text-xs text-white/50">MARANELLO PASS // EXPORTABLE HIGH-RES BADGE</p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-mono text-xs text-white/70 mb-1">MEMBER NAME</label>
            <input
              type="text"
              value={tifosiName}
              onChange={(e) => setTifosiName(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-3 py-2 text-white font-display uppercase tracking-wider focus:outline-none focus:border-ferrari-red"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 mb-1">FAVORITE DRIVER #</label>
            <select
              value={driverNum}
              onChange={(e) => setDriverNum(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-ferrari-red"
            >
              <option value="#16">#16 - Charles Leclerc</option>
              <option value="#44">#44 - Lewis Hamilton (2025+)</option>
              <option value="#55">#55 - Carlos Sainz</option>
              <option value="#5">#5 - Sebastian Vettel</option>
              <option value="#1">#1 - Michael Schumacher (7x WDC)</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 mb-1">MEMBERSHIP TIER</label>
            <select
              value={memberTier}
              onChange={(e) => setMemberTier(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-ferrari-red"
            >
              <option value="CORSE CLIENTI VIP">CORSE CLIENTI VIP</option>
              <option value="SCUDERIA PIT CREW">SCUDERIA PIT CREW</option>
              <option value="TIFOSI CURVA SUD">TIFOSI CURVA SUD</option>
              <option value="FERRARI HYPERCAR PILOT">FERRARI HYPERCAR PILOT</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 mb-1">HOME CIRCUIT</label>
            <select
              value={circuit}
              onChange={(e) => setCircuit(e.target.value)}
              className="w-full bg-[#151924] border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-ferrari-red"
            >
              <option value="AUTODROMO NAZIONALE MONZA">MONZA (TEMPLE OF SPEED)</option>
              <option value="CIRCUITO DI FIORANO">FIORANO (PRIVATE TEST TRACK)</option>
              <option value="AUTODROMO ENZO E DINO FERRARI">IMOLA</option>
              <option value="CIRCUIT DE SPA-FRANCORCHAMPS">SPA-FRANCORCHAMPS</option>
            </select>
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#1A1D29] via-[#0E1017] to-[#1F0606] border-2 border-ferrari-yellow/70 shadow-xl overflow-hidden mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-mono text-[9px] text-ferrari-yellow font-bold tracking-widest block">
                SCUDERIA FERRARI MARANELLO
              </span>
              <span className="font-display font-black text-lg text-white uppercase">{tifosiName}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-ferrari-red text-white font-mono font-bold text-xs">
              {driverNum}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/70">
            <div>
              <span className="text-[10px] text-white/40 block">TIER:</span>
              <span className="text-white font-bold">{memberTier}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 block">BLOOD TYPE:</span>
              <span className="text-ferrari-red font-bold">100% ROSSO CORSA</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Magnet padding={50} magnetStrength={2.5}>
          <button
            onClick={handleDownloadPass}
            disabled={downloading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-ferrari-red to-[#B80000] text-white font-display font-black text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,40,0,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'GENERATING HIGH-RES PNG...' : 'DOWNLOAD OFFICIAL PASSPORT (PNG)'}</span>
          </button>
        </Magnet>
      </div>
    </div>
  )
}

export default TifosiPassportModal

