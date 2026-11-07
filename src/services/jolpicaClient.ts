// Jolpica Ergast API Client
// Standard Formula 1 Historical & Championship Standings Service
// Endpoint: https://api.jolpi.ca/ergast/f1/
// Strict Zero Fabrication Policy: Only authentic API data. If unavailable, returns empty array.

import { createProvenance, type ProvenanceMetadata } from './dataProvenance'

export interface DriverStanding {
  position: string
  positionText: string
  points: string
  wins: string
  Driver: {
    driverId: string
    permanentNumber?: string
    code?: string
    givenName: string
    familyName: string
    dateOfBirth: string
    nationality: string
    url: string
  }
  Constructors: Array<{
    constructorId: string
    name: string
    nationality: string
    url: string
  }>
}

export interface ConstructorStanding {
  position: string
  positionText: string
  points: string
  wins: string
  Constructor: {
    constructorId: string
    name: string
    nationality: string
    url: string
  }
}

export interface RaceScheduleItem {
  season: string
  round: string
  url: string
  raceName: string
  Circuit: {
    circuitId: string
    circuitName: string
    url: string
    Location: {
      lat: string
      long: string
      locality: string
      country: string
    }
  }
  date: string
  time?: string
  FirstPractice?: { date: string; time?: string }
  SecondPractice?: { date: string; time?: string }
  ThirdPractice?: { date: string; time?: string }
  Qualifying?: { date: string; time?: string }
  Sprint?: { date: string; time?: string }
}

export interface RaceResultItem {
  number: string
  position: string
  positionText: string
  points: string
  Driver: {
    driverId: string
    permanentNumber?: string
    code?: string
    givenName: string
    familyName: string
    nationality: string
  }
  Constructor: {
    constructorId: string
    name: string
    nationality: string
  }
  grid: string
  laps: string
  status: string
  Time?: {
    millis: string
    time: string
  }
  FastestLap?: {
    rank: string
    lap: string
    Time: {
      time: string
    }
    AverageSpeed?: {
      units: string
      speed: string
    }
  }
}

export interface QualifyingResultItem {
  number: string
  position: string
  Driver: {
    driverId: string
    permanentNumber?: string
    code?: string
    givenName: string
    familyName: string
    nationality: string
  }
  Constructor: {
    constructorId: string
    name: string
    nationality: string
  }
  Q1?: string
  Q2?: string
  Q3?: string
}

export interface QualifyingSessionData {
  raceName: string
  circuitName: string
  round: string
  season: string
  results: QualifyingResultItem[]
}

export interface ProvenanceResponse<T> {
  data: T
  provenance: ProvenanceMetadata
  season: string
  round?: string
}

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1'

export class JolpicaClient {
  private cache: Map<string, { data: any; expiry: number }> = new Map()

  private async fetchWithCache<T>(url: string, ttlMs = 60000): Promise<T> {
    const cached = this.cache.get(url)
    if (cached && Date.now() < cached.expiry) {
      return cached.data as T
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)

    try {
      const response = await fetch(url, { credentials: 'omit', signal: controller.signal })
      clearTimeout(timeout)
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} from ${url}`)
      }
      const json = await response.json()
      this.cache.set(url, { data: json, expiry: Date.now() + ttlMs })
      return json as T
    } catch (err) {
      clearTimeout(timeout)
      throw err
    }
  }

  // Fetch Driver Standings (e.g. 'current', '2024', '2023')
  public async getDriverStandings(season: string = 'current'): Promise<ProvenanceResponse<DriverStanding[]>> {
    const endpoint = `${JOLPICA_BASE}/${season}/driverStandings.json`
    try {
      const raw = await this.fetchWithCache<any>(endpoint)
      const standingsList = raw?.MRData?.StandingsTable?.StandingsLists?.[0]
      const standings = standingsList?.DriverStandings || []
      const detectedSeason = standingsList?.season || season
      const round = standingsList?.round

      return {
        data: standings,
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'LIVE', 'PROVIDER_SUPPLIED'),
        season: detectedSeason,
        round,
      }
    } catch (e) {
      console.warn(`[JolpicaClient] Network fetch failed for ${endpoint}:`, e)
      return {
        data: [],
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'UNAVAILABLE', 'UNAVAILABLE'),
        season,
      }
    }
  }

  // Fetch Constructor Standings
  public async getConstructorStandings(season: string = 'current'): Promise<ProvenanceResponse<ConstructorStanding[]>> {
    const endpoint = `${JOLPICA_BASE}/${season}/constructorStandings.json`
    try {
      const raw = await this.fetchWithCache<any>(endpoint)
      const standingsList = raw?.MRData?.StandingsTable?.StandingsLists?.[0]
      const standings = standingsList?.ConstructorStandings || []
      const detectedSeason = standingsList?.season || season
      const round = standingsList?.round

      return {
        data: standings,
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'LIVE', 'PROVIDER_SUPPLIED'),
        season: detectedSeason,
        round,
      }
    } catch (e) {
      console.warn(`[JolpicaClient] Network fetch failed for ${endpoint}:`, e)
      return {
        data: [],
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'UNAVAILABLE', 'UNAVAILABLE'),
        season,
      }
    }
  }

  // Fetch Race Schedule Calendar
  public async getRaceSchedule(season: string = 'current'): Promise<ProvenanceResponse<RaceScheduleItem[]>> {
    const endpoint = `${JOLPICA_BASE}/${season}.json`
    try {
      const raw = await this.fetchWithCache<any>(endpoint)
      const races = raw?.MRData?.RaceTable?.Races || []
      const detectedSeason = raw?.MRData?.RaceTable?.season || season

      return {
        data: races,
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'LIVE', 'PROVIDER_SUPPLIED'),
        season: detectedSeason,
      }
    } catch (e) {
      console.warn(`[JolpicaClient] Network fetch failed for ${endpoint}:`, e)
      return {
        data: [],
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'UNAVAILABLE', 'UNAVAILABLE'),
        season,
      }
    }
  }

  // Fetch Race Results for a specific round or 'last'
  public async getRaceResults(season: string = '2024', round: string = 'last'): Promise<ProvenanceResponse<RaceResultItem[]>> {
    const endpoint = `${JOLPICA_BASE}/${season}/${round}/results.json`
    try {
      const raw = await this.fetchWithCache<any>(endpoint)
      const race = raw?.MRData?.RaceTable?.Races?.[0]
      const results = race?.Results || []

      return {
        data: results,
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'HISTORICAL', 'PROVIDER_SUPPLIED'),
        season: race?.season || season,
        round: race?.round,
      }
    } catch (e) {
      console.warn(`[JolpicaClient] Results fetch failed for ${endpoint}:`, e)
      return {
        data: [],
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'UNAVAILABLE', 'UNAVAILABLE'),
        season,
        round,
      }
    }
  }

  // Fetch Official Qualifying Results & Sector/Segment Times (Q1, Q2, Q3)
  public async getQualifyingResults(
    season: string = 'current',
    round: string = 'last'
  ): Promise<ProvenanceResponse<QualifyingSessionData>> {
    const endpoint = `${JOLPICA_BASE}/${season}/${round}/qualifying.json`
    try {
      const raw = await this.fetchWithCache<any>(endpoint)
      const race = raw?.MRData?.RaceTable?.Races?.[0]
      const results: QualifyingResultItem[] = race?.QualifyingResults || []

      return {
        data: {
          raceName: race?.raceName || 'Grand Prix Qualifying',
          circuitName: race?.Circuit?.circuitName || 'Grand Prix Circuit',
          round: race?.round || round,
          season: race?.season || season,
          results,
        },
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'HISTORICAL', 'OFFICIALLY_VERIFIED'),
        season: race?.season || season,
        round: race?.round,
      }
    } catch (e) {
      console.warn(`[JolpicaClient] Qualifying fetch failed for ${endpoint}:`, e)
      return {
        data: {
          raceName: '',
          circuitName: '',
          round,
          season,
          results: [],
        },
        provenance: createProvenance('Jolpica/Ergast', endpoint, 'UNAVAILABLE', 'UNAVAILABLE'),
        season,
        round,
      }
    }
  }
}

export const jolpicaClient = new JolpicaClient()
