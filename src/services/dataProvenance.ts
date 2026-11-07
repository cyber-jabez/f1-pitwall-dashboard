// Data Provenance & Verification Metadata Architecture
// Enforces 100% Authentic Data Policy: No fabrication, traceable source endpoints.

export type VerificationStatus =
  | 'OFFICIALLY_VERIFIED' // Verified against official FIA / Scuderia Ferrari publications
  | 'PROVIDER_SUPPLIED'  // Sourced directly from OpenF1 / Jolpica Ergast API
  | 'HISTORICAL_ARCHIVE' // Authenticated historical session record
  | 'UNAVAILABLE'        // Information not provided by source

export type FreshnessStatus =
  | 'LIVE'         // Actively streaming live from track session
  | 'HISTORICAL'   // Completed session archive
  | 'STALE'        // No new data received within timeout threshold
  | 'UNAVAILABLE'  // Currently unavailable or no session active

export interface ProvenanceMetadata {
  provider:
    | 'OpenF1'
    | 'Jolpica/Ergast'
    | 'FIA Official'
    | 'Scuderia Ferrari Official'
    | 'Wikipedia Commons'
    | 'livetiming.formula1.com'
    | 'Open-Meteo Track Radar'
  endpoint: string
  retrievedAt: string
  sessionKey?: number | string
  verificationStatus: VerificationStatus
  freshnessStatus: FreshnessStatus
  isLive: boolean
  disclaimer?: string
}

export function createProvenance(
  provider: ProvenanceMetadata['provider'],
  endpoint: string,
  freshness: FreshnessStatus = 'HISTORICAL',
  verification: VerificationStatus = 'PROVIDER_SUPPLIED',
  sessionKey?: number | string
): ProvenanceMetadata {
  return {
    provider,
    endpoint,
    retrievedAt: new Date().toISOString(),
    sessionKey,
    verificationStatus: verification,
    freshnessStatus: freshness,
    isLive: freshness === 'LIVE',
  }
}

