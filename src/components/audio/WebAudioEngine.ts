// High-Fidelity Web Audio API Synthesizer for Ferrari V12 / F1 Engines & Pit Box
export class FerrariAudioEngine {
  private ctx: AudioContext | null = null
  private isRunning: boolean = false
  private masterGain: GainNode | null = null
  private oscHarmonics: OscillatorNode[] = []
  private oscGains: GainNode[] = []
  private filter: BiquadFilterNode | null = null
  private distortion: WaveShaperNode | null = null
  private analyser: AnalyserNode | null = null
  private currentRpm: number = 1000
  private targetRpm: number = 1000
  private animationId: number = 0
  private isMuted: boolean = false
  private engineType: 'v12' | 'v10' | 'v6_hybrid' = 'v12'
  private onPopCallback?: () => void

  constructor(onPop?: () => void) {
    this.onPopCallback = onPop
  }

  public init() {
    if (this.ctx) return
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AudioContextClass()
  }

  public start() {
    this.init()
    if (!this.ctx || this.isRunning) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime)

    // Analyser Node for live visualizer
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 64
    this.analyser.smoothingTimeConstant = 0.8

    // Distortion wave-shaper for exhaust rasp
    this.distortion = this.ctx.createWaveShaper()
    this.distortion.curve = this.makeDistortionCurve(18)
    this.distortion.oversample = '4x'

    // Resonant lowpass filter
    this.filter = this.ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.setValueAtTime(1400, this.ctx.currentTime)
    this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime)

    // Create 4 harmonic oscillators for realistic engine timbre
    const harmonicMultipliers = [1, 2, 3, 6]
    const gains = [0.4, 0.25, 0.15, 0.08]

    this.oscHarmonics = []
    this.oscGains = []

    harmonicMultipliers.forEach((mult, index) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      osc.type = index % 2 === 0 ? 'sawtooth' : 'triangle'
      
      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(gains[index], this.ctx.currentTime)

      osc.connect(gain)
      if (this.filter) gain.connect(this.filter)

      osc.start()
      this.oscHarmonics.push(osc)
      this.oscGains.push(gain)
    })

    if (this.filter && this.distortion && this.analyser && this.masterGain) {
      this.filter.connect(this.distortion)
      this.distortion.connect(this.analyser)
      this.analyser.connect(this.masterGain)
      this.masterGain.connect(this.ctx.destination)
    }

    this.isRunning = true
    this.updateLoop()
  }

  public stop() {
    if (!this.isRunning) return
    this.oscHarmonics.forEach(osc => {
      try {
        osc.stop()
        osc.disconnect()
      } catch (e) {
        // ignore
      }
    })
    this.oscHarmonics = []
    this.oscGains = []
    cancelAnimationFrame(this.animationId)
    this.isRunning = false
  }

  public setRpm(rpm: number) {
    this.targetRpm = Math.max(900, Math.min(rpm, 9500))
  }

  public setEngineType(type: 'v12' | 'v10' | 'v6_hybrid') {
    this.engineType = type
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime, 0.05)
    }
    return this.isMuted
  }

  public getFrequencyData(array: any) {
    if (this.analyser && this.isRunning && !this.isMuted) {
      this.analyser.getByteFrequencyData(array)
    } else {
      array.fill(0)
    }
  }

  public playExhaustPop() {
    if (!this.ctx || this.isMuted || !this.isRunning) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08)

    gain.gain.setValueAtTime(0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.1)

    this.onPopCallback?.()
  }

  // Turbo blow-off valve flutter ("stututu")
  public playTurboFlutter() {
    if (!this.ctx || this.isMuted) return
    const now = this.ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      const startT = now + i * 0.06
      osc.frequency.setValueAtTime(1200 - i * 150, startT)
      osc.frequency.exponentialRampToValueAtTime(500, startT + 0.05)
      gain.gain.setValueAtTime(0.2 - i * 0.04, startT)
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.05)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startT)
      osc.stop(startT + 0.06)
    }
  }

  // Formula 1 Pneumatic Wheel Gun Impact Wrench Sound
  public playWheelGunSound() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.linearRampToValueAtTime(780, now + 0.15)
    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.22)
  }

  // Hydraulic Jack Drop Thud
  public playJackDropSound() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.18)
    gain.gain.setValueAtTime(0.6, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.22)
  }

  // Formula 1 Carbon Fiber Paddle Shifter Clack
  public playPaddleShiftSound(direction: 'up' | 'down' = 'up') {
    if (!this.ctx) this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const now = this.ctx.currentTime
    // High metallic tick
    const tick = this.ctx.createOscillator()
    const tickGain = this.ctx.createGain()
    tick.type = 'square'
    tick.frequency.setValueAtTime(direction === 'up' ? 2400 : 1800, now)
    tick.frequency.exponentialRampToValueAtTime(400, now + 0.035)
    tickGain.gain.setValueAtTime(0.35, now)
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    tick.connect(tickGain)
    tickGain.connect(this.ctx.destination)
    tick.start(now)
    tick.stop(now + 0.045)

    // Low mechanical hydraulic thud
    const thud = this.ctx.createOscillator()
    const thudGain = this.ctx.createGain()
    thud.type = 'triangle'
    thud.frequency.setValueAtTime(160, now)
    thud.frequency.exponentialRampToValueAtTime(40, now + 0.07)
    thudGain.gain.setValueAtTime(0.4, now)
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    thud.connect(thudGain)
    thudGain.connect(this.ctx.destination)
    thud.start(now)
    thud.stop(now + 0.085)
  }

  // Tactile Mechanical Dial/Button Click
  public playMechanicalClick() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1800, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.02)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }

  // F1 KERS / MGU-K Overtake Boost Chime & Electronic Surge
  public playOvertakeBoost() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const now = this.ctx.currentTime
    // Dual frequency harmonic surge
    ;[600, 900, 1500].forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.linearRampToValueAtTime(freq * 1.8, now + 0.35)
      gain.gain.setValueAtTime(0.12 - idx * 0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.42)
    })
  }

  // Realistic Pit Radio Static Beep
  public playRadioBeep() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, now)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.09)
  }

  public playPitRadio(radioMessage: string) {
    this.playRadioBeep()
    if ('speechSynthesis' in window && !this.isMuted) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(radioMessage)
      utterance.pitch = 0.92
      utterance.rate = 1.08
      const voices = window.speechSynthesis.getVoices()
      const ferrariVoice = voices.find(v => v.lang.includes('it') || v.name.includes('Italian')) || voices.find(v => v.lang.includes('en-GB'))
      if (ferrariVoice) utterance.voice = ferrariVoice
      setTimeout(() => {
        window.speechSynthesis.speak(utterance)
      }, 100)
    }
  }

  private updateLoop = () => {
    if (!this.isRunning || !this.ctx) return

    const delta = (this.targetRpm - this.currentRpm) * 0.12
    const previousRpm = this.currentRpm
    this.currentRpm += delta

    if (previousRpm - this.currentRpm > 180 && this.currentRpm > 5500 && Math.random() < 0.2) {
      this.playExhaustPop()
      if (this.engineType === 'v6_hybrid') {
        this.playTurboFlutter()
      }
    }

    const cylinders = this.engineType === 'v12' ? 12 : this.engineType === 'v10' ? 10 : 6
    const baseFreq = (this.currentRpm / 60) * (cylinders / 2) * (this.engineType === 'v10' ? 1.4 : 1)

    const now = this.ctx.currentTime

    this.oscHarmonics.forEach((osc, i) => {
      const mult = [1, 2, 3, 5][i]
      osc.frequency.setTargetAtTime(baseFreq * mult, now, 0.03)
    })

    if (this.filter) {
      const filterFreq = 1000 + (this.currentRpm / 9500) * 6500
      this.filter.frequency.setTargetAtTime(filterFreq, now, 0.04)
    }

    this.animationId = requestAnimationFrame(this.updateLoop)
  }

  private makeDistortionCurve(amount: number) {
    const k = amount
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    const deg = Math.PI / 180
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }
    return curve
  }
}
