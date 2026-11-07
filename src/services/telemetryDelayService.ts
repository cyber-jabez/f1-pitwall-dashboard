// Telemetry Delay Buffer Service
// Allows users to delay real-time F1 SignalR telemetry to match HLS/CDN broadcast video streams.
// Implements a rolling historical ring buffer with millisecond precision and localStorage persistence.

import type {
  F1LiveDriverTiming,
  F1LiveStatus,
  F1LiveWeather,
  F1LiveClock,
  F1LiveTeamRadioMessage,
  F1LiveNextSession,
} from './f1LiveApiClient'

export interface TelemetryBufferSnapshot {
  timestamp: number // Epoch ms when received from SignalR / API
  timingDrivers: F1LiveDriverTiming[]
  status: F1LiveStatus | null
  weather: F1LiveWeather | null
  clock: F1LiveClock | null
  raceControl: Array<{
    time: string
    category: string
    message: string
    flag?: string
    scope?: string
  }>
  radioMessages: F1LiveTeamRadioMessage[]
  nextSession: F1LiveNextSession | null
  sessionName: string
}

export interface DelayQueryResult {
  snapshot: TelemetryBufferSnapshot | null
  requestedDelaySeconds: number
  effectiveDelaySeconds: number
  bufferedSeconds: number
  isBuffering: boolean
  totalSnapshots: number
}

class TelemetryDelayService {
  private snapshots: TelemetryBufferSnapshot[] = []
  private readonly maxBufferMs = 15 * 60 * 1000 // 15 minutes of historical telemetry buffer
  private delaySeconds = 0
  private listeners: Set<(delay: number) => void> = new Set()
  private storageKey = 'f1_telemetry_delay_seconds'

  constructor() {
    // Restore persisted delay preference if present
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved !== null) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 300) {
          this.delaySeconds = parsed
        }
      }
    } catch {
      // LocalStorage access fallback
      this.delaySeconds = 0
    }
  }

  /**
   * Pushes a new telemetry snapshot into the circular buffer.
   */
  public pushSnapshot(data: Omit<TelemetryBufferSnapshot, 'timestamp'>): void {
    const now = Date.now()
    const newSnapshot: TelemetryBufferSnapshot = {
      timestamp: now,
      timingDrivers: data.timingDrivers,
      status: data.status,
      weather: data.weather,
      clock: data.clock,
      raceControl: data.raceControl,
      radioMessages: data.radioMessages,
      nextSession: data.nextSession,
      sessionName: data.sessionName,
    }

    this.snapshots.push(newSnapshot)

    // Prune snapshots older than maxBufferMs
    const cutoff = now - this.maxBufferMs
    while (this.snapshots.length > 1 && this.snapshots[0].timestamp < cutoff) {
      this.snapshots.shift()
    }
  }

  /**
   * Retrieve snapshot delayed by user-specified seconds.
   * If delaySeconds === 0, returns the latest instantaneous snapshot.
   */
  public getSnapshotAtDelay(delaySeconds: number = this.delaySeconds): DelayQueryResult {
    if (this.snapshots.length === 0) {
      return {
        snapshot: null,
        requestedDelaySeconds: delaySeconds,
        effectiveDelaySeconds: 0,
        bufferedSeconds: 0,
        isBuffering: false,
        totalSnapshots: 0,
      }
    }

    const latestSnapshot = this.snapshots[this.snapshots.length - 1]
    const oldestSnapshot = this.snapshots[0]
    const bufferedSeconds = Math.max(
      0,
      Math.floor((latestSnapshot.timestamp - oldestSnapshot.timestamp) / 1000)
    )

    // Instant live (0s delay)
    if (delaySeconds <= 0) {
      return {
        snapshot: latestSnapshot,
        requestedDelaySeconds: 0,
        effectiveDelaySeconds: 0,
        bufferedSeconds,
        isBuffering: false,
        totalSnapshots: this.snapshots.length,
      }
    }

    const now = Date.now()
    const targetTimestamp = now - delaySeconds * 1000

    // If requested delay reaches further back than our oldest buffered snapshot:
    if (targetTimestamp <= oldestSnapshot.timestamp) {
      const actualElapsedDelay = Math.floor((now - oldestSnapshot.timestamp) / 1000)
      return {
        snapshot: oldestSnapshot,
        requestedDelaySeconds: delaySeconds,
        effectiveDelaySeconds: actualElapsedDelay,
        bufferedSeconds,
        isBuffering: bufferedSeconds < delaySeconds,
        totalSnapshots: this.snapshots.length,
      }
    }

    // Binary search to find snapshot closest to targetTimestamp
    let low = 0
    let high = this.snapshots.length - 1
    let bestIndex = high

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const diff = this.snapshots[mid].timestamp - targetTimestamp

      if (Math.abs(diff) < Math.abs(this.snapshots[bestIndex].timestamp - targetTimestamp)) {
        bestIndex = mid
      }

      if (this.snapshots[mid].timestamp < targetTimestamp) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    const chosen = this.snapshots[bestIndex]
    const effectiveDelay = Math.max(0, Math.floor((now - chosen.timestamp) / 1000))

    return {
      snapshot: chosen,
      requestedDelaySeconds: delaySeconds,
      effectiveDelaySeconds: effectiveDelay,
      bufferedSeconds,
      isBuffering: false,
      totalSnapshots: this.snapshots.length,
    }
  }

  public getDelay(): number {
    return this.delaySeconds
  }

  public setDelay(seconds: number): void {
    const clamped = Math.max(0, Math.min(300, Math.round(seconds)))
    this.delaySeconds = clamped
    try {
      localStorage.setItem(this.storageKey, String(clamped))
    } catch {
      // Ignored
    }
    this.notifyListeners()
  }

  public adjustDelay(deltaSeconds: number): void {
    this.setDelay(this.delaySeconds + deltaSeconds)
  }

  public subscribe(callback: (delay: number) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.delaySeconds)
      } catch (err) {
        console.error('Error notifying telemetry delay listener:', err)
      }
    })
  }

  public getBufferStats(): {
    bufferedSeconds: number
    snapshotsCount: number
    delaySeconds: number
  } {
    if (this.snapshots.length < 2) {
      return {
        bufferedSeconds: 0,
        snapshotsCount: this.snapshots.length,
        delaySeconds: this.delaySeconds,
      }
    }
    const oldest = this.snapshots[0].timestamp
    const latest = this.snapshots[this.snapshots.length - 1].timestamp
    return {
      bufferedSeconds: Math.max(0, Math.floor((latest - oldest) / 1000)),
      snapshotsCount: this.snapshots.length,
      delaySeconds: this.delaySeconds,
    }
  }

  public clearBuffer(): void {
    this.snapshots = []
  }
}

export const telemetryDelayService = new TelemetryDelayService()

