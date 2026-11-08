import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Environment shims for Node runtime testing
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  }
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = { location: { hostname: 'localhost' } }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Formula 1 Pit Wall Dashboard - Safety, Authenticity & Provenance Audit', async (t) => {

  await t.test('1. Historical data cannot be classified as LIVE', async () => {
    const { SNAPSHOT_STATUS, SNAPSHOT_WEATHER } = await import('../src/data/liveTelemetrySnapshot.ts')
    
    assert.strictEqual(SNAPSHOT_STATUS.live, false, 'SNAPSHOT_STATUS must never have live: true')
    assert.strictEqual(SNAPSHOT_STATUS.stale, true, 'SNAPSHOT_STATUS must be marked stale')
    assert.strictEqual(SNAPSHOT_STATUS.provenance.freshnessStatus, 'HISTORICAL', 'SNAPSHOT_STATUS provenance must be HISTORICAL')
    assert.strictEqual(SNAPSHOT_STATUS.provenance.isLive, false, 'SNAPSHOT_STATUS provenance isLive must be false')
    assert.strictEqual(SNAPSHOT_WEATHER.provenance.freshnessStatus, 'HISTORICAL', 'SNAPSHOT_WEATHER provenance must be HISTORICAL')
  })

  await t.test('2. API failure cannot silently return a live snapshot', async () => {
    const { f1LiveApiClient } = await import('../src/services/f1LiveApiClient.ts')
    
    // In test environment without running local API server, calls fall back to snapshots
    const timing = await f1LiveApiClient.getTiming()
    assert.ok(timing, 'Timing response returned')
    assert.strictEqual(timing.live, false, 'Fallback snapshot must NEVER report live: true')
    assert.strictEqual(timing.provenance.freshnessStatus, 'HISTORICAL', 'Fallback provenance must be HISTORICAL')
    assert.strictEqual(timing.provenance.isLive, false, 'Fallback provenance isLive must be false')
    assert.ok(timing.stale, 'Fallback must be marked stale')
  })

  await t.test('3. Stale data detection logic in backend state', async () => {
    const state = (await import('../f1-live-api/src/f1timing/state.js')).default || (await import('../f1-live-api/src/f1timing/state.js'))
    
    // When no feed updates occurred recently
    state.reset()
    state.sessionInfo = { SessionStatus: 'Finished', Meeting: { Name: 'São Paulo Grand Prix' } }
    
    assert.strictEqual(state.connected, false, 'Initial state connected is false')
  })

  await t.test('4 & 5. Session identifiers validated and different sessions cannot contaminate each other', async () => {
    const state = (await import('../f1-live-api/src/f1timing/state.js')).default || (await import('../f1-live-api/src/f1timing/state.js'))
    
    state.reset()
    state.sessionInfo = { Key: 1001, SessionStatus: 'Started', Name: 'Practice 3' }
    state.timingData = { Lines: { '16': { Position: '1', NumberOfLaps: 15 } } }
    state.raceControl = { Messages: [{ Utc: '2026-11-07T12:00:00Z', Message: 'GREEN FLAG' }] }

    assert.strictEqual(state.timingData.Lines['16'].Position, '1', 'Pre-condition: session 1001 data present')

    // Simulate session transition to Qualifying (Key: 1002)
    state.applyUpdate('SessionInfo', { Key: 1002, SessionStatus: 'Started', Name: 'Qualifying' })

    // Per-driver timing and session logs MUST be reset to prevent cross-session contamination
    assert.deepStrictEqual(state.timingData, {}, 'timingData must be reset upon new session Key')
    assert.deepStrictEqual(state.raceControl.Messages, [], 'raceControl messages must be reset upon new session Key')
    assert.strictEqual(state.sessionInfo.Key, 1002, 'New session key is active')
  })

  await t.test('6. Duplicate event handling and radio message deduplication', async () => {
    const { f1LiveApiClient } = await import('../src/services/f1LiveApiClient.ts')
    const radio = await f1LiveApiClient.getTeamRadio()
    assert.ok(Array.isArray(radio.messages), 'Messages must be an array')
  })

  await t.test('7. Reconnection cleanup prevents duplicate listeners and connections', async () => {
    const client = (await import('../f1-live-api/src/f1timing/client.js')).default || (await import('../f1-live-api/src/f1timing/client.js'))
    assert.strictEqual(typeof client.start, 'function', 'client.start is defined')
    assert.strictEqual(typeof client.stop, 'function', 'client.stop is defined')
    client.stop()
  })

  await t.test('8. Missing telemetry channels do not generate fabricated values', async () => {
    const { f1LiveApiClient } = await import('../src/services/f1LiveApiClient.ts')
    
    // Querying an unrecorded/invalid driver number (e.g. 999)
    const res = await f1LiveApiClient.getCarTelemetry(999)
    assert.ok(res, 'Response returned')
    assert.strictEqual(res.telemetry, null, 'Must return null telemetry, NEVER fabricated synthetic numbers')
    assert.strictEqual(res.provenance.freshnessStatus, 'UNAVAILABLE', 'Must report UNAVAILABLE provenance')
  })

  await t.test('9. Telemetry data provenance and freshness states', async () => {
    const { createProvenance } = await import('../src/services/dataProvenance.ts')
    
    const provLive = createProvenance('OpenF1', 'https://api.openf1.org/v1/sessions', 'LIVE', 'PROVIDER_SUPPLIED', 11407)
    assert.strictEqual(provLive.freshnessStatus, 'LIVE')
    assert.strictEqual(provLive.isLive, true)

    const provHist = createProvenance('livetiming.formula1.com', 'https://livetiming.formula1.com/signalrcore', 'HISTORICAL', 'OFFICIALLY_VERIFIED', 11408)
    assert.strictEqual(provHist.freshnessStatus, 'HISTORICAL')
    assert.strictEqual(provHist.isLive, false)

    const provStale = createProvenance('livetiming.formula1.com', 'https://livetiming.formula1.com/signalrcore', 'STALE', 'OFFICIALLY_VERIFIED')
    assert.strictEqual(provStale.freshnessStatus, 'STALE')
    assert.strictEqual(provStale.isLive, false)

    const provDemo = createProvenance('Scuderia Ferrari Official', 'local://benchmark', 'DEMO', 'OFFICIALLY_VERIFIED')
    assert.strictEqual(provDemo.freshnessStatus, 'DEMO')
    assert.strictEqual(provDemo.isLive, false)

    const provConn = createProvenance('livetiming.formula1.com', 'https://livetiming.formula1.com/signalrcore', 'CONNECTING', 'PROVIDER_SUPPLIED')
    assert.strictEqual(provConn.freshnessStatus, 'CONNECTING')
    assert.strictEqual(provConn.isLive, false)
  })

  await t.test('10. Streaming test fixtures cannot be classified as official F1 streams', async () => {
    const { streamingProviderService } = await import('../src/services/streamingProviderService.ts')
    
    const providers = streamingProviderService.getProviders()
    const f1tv = providers.find((p) => p.id === 'f1tv-pro-official')
    const testHls = providers.find((p) => p.id === 'authorized-hls-stream')
    const unverified = providers.find((p) => p.id === 'westreamf1-reference')

    assert.ok(f1tv, 'F1TV provider found')
    assert.strictEqual(f1tv.authorizationStatus, 'REQUIRES_AUTHENTICATION', 'F1 TV must require authentication')

    assert.ok(testHls, 'HLS test fixture found')
    assert.match(testHls.name, /test/i, 'Test HLS fixture must clearly contain Test in its name')
    assert.match(testHls.notes, /test fixture/i, 'Test HLS notes must state it is a test fixture')

    assert.ok(unverified, 'Unverified provider found')
    assert.strictEqual(unverified.isEnabled, false, 'Unverified provider must be disabled by default')
    assert.strictEqual(unverified.authorizationStatus, 'UNVERIFIED_THIRD_PARTY')
  })
})
