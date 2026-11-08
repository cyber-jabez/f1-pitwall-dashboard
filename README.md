# Scuderia Ferrari & Formula 1 Pit Wall Intelligence Dashboard

An authentic, production-grade Formula 1 telemetry, race timing, and Scuderia Ferrari mission-control platform. Powered by direct official F1 live timing feeds (FOM SignalR Core WebSocket), OpenF1 telemetry clusters, and Jolpica/Ergast championship databases.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and an Express/Node.js live timing daemon (`f1-live-api`).

---

## 1. System Architecture

```mermaid
flowchart TD
    subgraph Circuit & Official Providers
        FOM["Official F1 Live Timing\n(livetiming.formula1.com/signalrcore)"]
        OpenF1["OpenF1 Telemetry API\n(api.openf1.org/v1)"]
        Jolpica["Jolpica Ergast API\n(api.jolpi.ca/ergast/f1)"]
        OpenMeteo["Open-Meteo Track Sensors\n(api.open-meteo.com)"]
    end

    subgraph Backend Microservice [f1-live-api]
        SigClient["SignalR WebSocket Client\n(f1timing/client.js)"]
        State["In-Memory State & Merging\n(f1timing/state.js)"]
        Turso["Turso / LibSQL Store\n(f1_session_results, f1_kv_store)"]
        APIRouter["Express REST & SSE Router\n(/status, /timing, /car/:num, /stream)"]
    end

    subgraph Frontend Client [Vite + React 19]
        F1LiveClient["f1LiveApiClient.ts"]
        OpenF1Client["openf1LiveClient.ts"]
        DelayService["telemetryDelayService.ts\n(Video broadcast sync buffer)"]
        StreamService["streamingProviderService.ts\n(Broadcaster & HLS manifests)"]
        PitWallView["PitWallCommandView.tsx\n(Leaderboard, Comms, Radar, Weather)"]
        CompareView["TelemetryCompareView.tsx\n(Verstappen vs Hamilton, Ferrari duel)"]
        FerrariView["FerrariTelemetryCommandView.tsx\n(LEC #16 vs HAM #44 duel)"]
        LiveRaceView["LiveRaceView.tsx\n(Video Stage & Provenance Audit)"]
    end

    FOM -->|SignalR Core JSON Frames| SigClient
    SigClient --> State
    State <--> Turso
    State --> APIRouter

    APIRouter -->|REST / SSE (~3.7Hz)| F1LiveClient
    OpenF1 --> OpenF1Client
    Jolpica --> Frontend Client
    OpenMeteo --> OpenF1Client

    F1LiveClient --> DelayService
    DelayService --> PitWallView
    F1LiveClient --> CompareView
    OpenF1Client --> FerrariView
    StreamService --> LiveRaceView
```

---

## 2. Strict Data Provenance & Freshness Model

The application enforces a **Zero Fabrication Policy**. No synthetic data, imaginary telemetry, or fake numbers (`Math.random()`) are permitted.

Every data payload carries explicit provenance metadata (`src/services/dataProvenance.ts`):

| Freshness State | Definition | UI Treatment |
| :--- | :--- | :--- |
| **`LIVE`** | Real-time stream actively transmitting from the circuit during a green-flag or active session | Pulsing red badge with live beacon |
| **`HISTORICAL`** | Completed session record retaining its authentic provider timestamp and session ID | Neutral slate badge with session archive tag |
| **`STALE`** | Feed disconnected or no heartbeat received within timeout threshold (> 5 minutes) | Amber warning badge |
| **`DEMO`** | Verified benchmark session replay or calibration sequence | Purple badge clearly labelled DEMO |
| **`CONNECTING`** | Negotiating WebSocket handshake or polling API provider | Sky blue badge with pulsing indicator |
| **`UNAVAILABLE`** | Off-track, winter break, or sensors unmeasured | Honest empty state with `"N/A"` |

---

## 3. Data Providers & Endpoints

| Category | Provider | Upstream Endpoint | Role |
| :--- | :--- | :--- | :--- |
| **SignalR Timing Feed** | Formula One Management (FOM) | `wss://livetiming.formula1.com/signalrcore` | Sub-second mini-sectors, speed traps, timing tower, tyres, track status, team radio clips |
| **Car Telemetry** | OpenF1 API | `https://api.openf1.org/v1/car_data` | SECU channels: speed (km/h), RPM, throttle (%), brake, gear, DRS |
| **Track Meteorology** | Open-Meteo & OpenF1 | `https://api.open-meteo.com/v1/forecast` | Measured ambient/track temps, wind vector, barometric pressure, rain |
| **Race Control Logs** | FOM SignalR & OpenF1 | `https://livetiming.formula1.com/signalrcore` | Official FIA race director flags, steward investigations, safety car notices |
| **Championship Standings** | Jolpica / Ergast | `https://api.jolpi.ca/ergast/f1/{season}/...` | Official Drivers' and Constructors' World Championship standings |

---

## 4. Key Capabilities

### A. Live Pit Wall Command Center (`#pitwall`)
- **Adaptive Leaderboard**: Automatic layout adjustment for Qualifying (Q1/Q2/Q3 cutoffs), Practice (P1/P2/P3), Sprint, and Grand Prix race pace gaps.
- **SECU Car Telemetry Card**: Multi-channel gauges for engine RPM, transmission gear, speed, throttle pressure, brake application, and DRS status.
- **Micro-Sectors Matrix**: 3-sector breakdown with personal best (green), overall best (purple), and speed traps (`I1`, `I2`, `FL`, `ST`).
- **Team Radio Comms**: Real-time team radio messages with integrated audio playback from FOM feeds.
- **Weather & Doppler Radar**: Real-time meteorological telemetry and precipitation probability radar.
- **Broadcast Delay Synchronizer**: Adjustable millisecond buffer allowing fans to synchronize live telemetry with delayed broadcast video streams.

### B. Driver Comparison: Max Verstappen vs Lewis Hamilton (`#compare`)
- **Dynamic Head-to-Head Comparison**: Select any two drivers on the grid (defaulting to Max Verstappen #1 vs Lewis Hamilton #44 or Charles Leclerc #16).
- **Genuine Available Channels**: Real comparison of speed (km/h), throttle (%), brake (%), gear, engine RPM, DRS, best lap time, and delta calculations.
- **No Fabricated Curves**: Discrete authentic sensor readings with honest `"N/A"` for unmeasured channels.
- **Scuderia Ferrari Duel**: Dedicated 1-click preset for Leclerc vs Hamilton.

### C. Live Race & Video Stage (`#live-race`)
- **HLS Player**: Tested with adaptive bitrate HTTP Live Streaming manifests.
- **Configurable Broadcaster Portals**: Official F1 TV Pro subscriber portal, Sky Sports F1, and diagnostic test stream fixtures clearly labeled.
- **Zero Third-Party Injection**: Unverified third-party streams remain strictly disabled by default.

---

## 5. Environment Variables & Configuration

### Backend Daemon (`f1-live-api/.env`)
```bash
# Server Port
PORT=3001

# Turso / LibSQL Database (Optional - gracefully degraded if omitted)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token

# Residential HTTP CONNECT Proxy (Optional - to bypass CloudFront WAF if required)
F1_PROXY_URL=http://user:pass@proxy-host:port

# Optional API Key Authentication for backend endpoints
F1_API_KEY=your-secret-api-key
```

### Frontend (`.env` or LocalStorage)
- `f1_live_api_url`: Custom base URL for the backend daemon (defaults to `/api/f1live` in development).
- `openf1_api_key`: Optional API key for authenticated OpenF1 tier access.

---

## 6. Installation & Startup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd f1-live-api
npm install
cd ..
```

### Running in Development
```bash
# 1. Start the F1 Live Timing backend daemon (Port 3001)
npm run api

# 2. In a separate terminal, start the Vite frontend (Port 5173)
npm run dev
```

### Building for Production
```bash
npm run build
```

### Running Tests
The project includes an automated audit regression test suite verifying data authenticity, session validation, connection cleanup, and provider classification:
```bash
npm test
```

---

## 7. API Reference (Backend Daemon)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/status` | Connection state, session metadata, clock, track status, and provenance |
| `GET` | `/timing` | Full leaderboard with sectors, speed traps, and car telemetry |
| `GET` | `/timing/:number` | Timing data for a single car number |
| `GET` | `/car/:number` | Live or historical SECU telemetry channels (RPM, speed, gear, throttle, brake, DRS) |
| `GET` | `/weather` | Real-time weather sensor measurements |
| `GET` | `/race-control` | Race director notices, yellow/red flags, safety car deployments |
| `GET` | `/team-radio` | Team radio audio recordings with direct MP3 streaming URLs |
| `GET` | `/calendar` | FIA 2026 World Championship calendar |
| `GET` | `/calendar/next` | Countdown to next upcoming session |
| `GET` | `/stream/timing` | Server-Sent Events (SSE) live timing stream at ~3.7Hz |

---

## 8. Known Limitations & Upstream Constraints

1. **Winter Break / Off-Season**: When no F1 cars are on track, the live SignalR socket receives no timing frames. The dashboard displays the verified historical Brazilian Grand Prix session snapshot with an honest `HISTORICAL` or `STALE` provenance badge.
2. **OpenF1 Free Tier Limits**: OpenF1 free endpoints may return HTTP 401 or introduce rate-limiting during live race events. When 401 is encountered, the dashboard honesty reports that an API key is required and does NOT falsely claim that a race is active.
3. **Official F1 TV Pro Broadcast Rights**: F1 TV Pro is a premium subscription portal. The dashboard provides direct links and authenticated portal integration, but does not circumvent FIA access control or copyright protection.

---

## 9. Verification & Compliance Declaration

- **Zero Synthetic Telemetry**: Verified 0 `Math.random()` jitter generators in telemetry services.
- **Session Identity Isolation**: Verified that SessionInfo.Key roll resets session-scoped state to prevent cross-session contamination.
- **Connection Teardown**: Verified WebSocket listeners and keepalive timers are completely cleared before reconnection.
- **Provider Labeling**: Public HLS fixtures are clearly designated as diagnostic test streams.

---

## License
MIT License. Formula 1, F1, Scuderia Ferrari, and related marks are trademarks of their respective owners.
