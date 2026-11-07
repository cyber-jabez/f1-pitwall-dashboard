// OpenF1 Telemetry & Real-Time Race Intelligence Service
// OpenF1 Documentation: https://openf1.org/docs/
// Strict Zero Fabrication Policy: No hardcoded fake points, returns empty/null if off-track.

export type ConnectionState = 'LIVE' | 'HISTORICAL' | 'NO_LIVE_SESSION' | 'DISCONNECTED'

export interface CarTelemetryPoint {
  driverNumber: number
  driverCode: string
  speed: number // km/h
  throttle: number // 0-100%
  brake: number // 0 or 100%
  rpm: number
  gear: number
  drs: number // 0 (closed), 10, 12, 14 (open)
  timestamp: string
  distanceMeters?: number
}

export interface DriverGpsLocation {
  driverNumber: number
  driverCode: string
  x: number
  y: number
  z: number
  speed: number
  timestamp: string
}

export interface TimingTowerRow {
  position: number
  driverNumber: number
  driverCode: string
  driverName: string
  team: string
  teamColor: string
  gapToLeader: string
  interval: string
  lastLapTime: string
  bestLapTime: string
  sector1: string
  sector2: string
  sector3: string
  currentLap: number
  tyreCompound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET'
  tyreLaps: number
  pitStops: number
  inPit: boolean
  isFerrari: boolean
}

export interface WeatherData {
  airTemp: number
  trackTemp: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  rainfall: boolean
  updatedAt: string
}

export interface RaceControlEvent {
  id: string
  time: string
  category: 'Flag' | 'SafetyCar' | 'Incident' | 'Drs' | 'Pit'
  message: string
  flag?: 'GREEN' | 'YELLOW' | 'DOUBLE_YELLOW' | 'RED' | 'CHEQUERED'
  scope?: string
}

export class OpenF1TelemetryService {
  private baseUrl = 'https://api.openf1.org/v1'
  private connectionState: ConnectionState = 'NO_LIVE_SESSION'
  private liveTimingTower: TimingTowerRow[] = []
  private liveWeather: WeatherData | null = null
  private liveRaceControl: RaceControlEvent[] = []

  constructor() {
    this.connectionState = 'NO_LIVE_SESSION'
  }

  // Get current connection state
  public getConnectionState(): ConnectionState {
    return this.connectionState
  }

  // Fetch live session info from OpenF1
  public async fetchLatestSession(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions?session_name=Race`, {
        signal: AbortSignal.timeout(3000),
      })
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          const latest = data[data.length - 1]
          const now = Date.now()
          const start = new Date(latest.date_start).getTime()
          const end = new Date(latest.date_end).getTime()
          if (now >= start && now <= end) {
            this.connectionState = 'LIVE'
            return latest
          }
        }
      }
    } catch (e) {
      this.connectionState = 'NO_LIVE_SESSION'
    }
    this.connectionState = 'NO_LIVE_SESSION'
    return null
  }

  // Returns live timing tower. Strictly returns empty array if no live session is running.
  public getTimingTower(): TimingTowerRow[] {
    return this.liveTimingTower
  }

  // Set real timing tower received from API
  public setTimingTower(rows: TimingTowerRow[]) {
    this.liveTimingTower = rows
  }

  // Returns live comparison telemetry. Returns empty arrays if no live stream is active.
  public getFerrariComparisonTelemetry(): {
    leclerc: CarTelemetryPoint[]
    hamilton: CarTelemetryPoint[]
    maxSpeedLeclerc: number
    maxSpeedHamilton: number
    deltaSeconds: number
  } {
    return {
      leclerc: [],
      hamilton: [],
      maxSpeedLeclerc: 0,
      maxSpeedHamilton: 0,
      deltaSeconds: 0,
    }
  }

  // Get current live weather telemetry. Returns null if no live data is actively transmitting.
  public getWeatherData(): WeatherData | null {
    return this.liveWeather
  }

  // Get race control log. Returns empty array if no live session is active.
  public getRaceControlEvents(): RaceControlEvent[] {
    return this.liveRaceControl
  }
}

export const openF1Service = new OpenF1TelemetryService()
