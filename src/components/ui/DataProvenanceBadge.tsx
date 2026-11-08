import React, { useState } from 'react'
import type { ProvenanceMetadata } from '../../services/dataProvenance'

interface DataProvenanceBadgeProps {
  provenance: ProvenanceMetadata
  title?: string
  className?: string
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  provenance,
  title = 'Data Provenance & Verification',
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false)

  const getVerificationColor = (status: ProvenanceMetadata['verificationStatus']) => {
    switch (status) {
      case 'OFFICIALLY_VERIFIED':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40'
      case 'PROVIDER_SUPPLIED':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40'
      case 'HISTORICAL_ARCHIVE':
        return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/40'
      case 'UNAVAILABLE':
      default:
        return 'text-rose-400 bg-rose-950/40 border-rose-500/40'
    }
  }

  const getFreshnessColor = (status: ProvenanceMetadata['freshnessStatus']) => {
    switch (status) {
      case 'LIVE':
        return 'text-red-400 bg-red-950/50 border-red-500/40 animate-pulse'
      case 'HISTORICAL':
        return 'text-neutral-300 bg-neutral-900 border-neutral-700'
      case 'STALE':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/40'
      case 'DEMO':
        return 'text-purple-400 bg-purple-950/40 border-purple-500/40 font-bold'
      case 'CONNECTING':
        return 'text-sky-400 bg-sky-950/40 border-sky-500/40 animate-pulse'
      case 'UNAVAILABLE':
      default:
        return 'text-neutral-500 bg-neutral-950 border-neutral-800'
    }
  }

  return (
    <div
      className={`border rounded-lg p-3 bg-neutral-950/90 backdrop-blur-sm transition-all ${className} ${
        provenance.freshnessStatus === 'LIVE' ? 'border-red-900/50' : 'border-neutral-800'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            {provenance.freshnessStatus === 'LIVE' ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            )}
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getVerificationColor(
              provenance.verificationStatus
            )}`}
          >
            {provenance.verificationStatus.replace('_', ' ')}
          </span>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getFreshnessColor(
              provenance.freshnessStatus
            )}`}
          >
            {provenance.freshnessStatus}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-mono text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition"
          >
            {expanded ? 'Hide Source' : 'Audit Trace'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-2 border-t border-neutral-800/80 text-[11px] font-mono space-y-1 text-neutral-400">
          <div className="flex flex-wrap gap-x-4">
            <span>
              <strong className="text-neutral-200">Provider:</strong> {provenance.provider}
            </span>
            {provenance.sessionKey && (
              <span>
                <strong className="text-neutral-200">Session Key:</strong> {provenance.sessionKey}
              </span>
            )}
            <span>
              <strong className="text-neutral-200">Retrieved:</strong>{' '}
              {new Date(provenance.retrievedAt).toLocaleTimeString()} (UTC {new Date(provenance.retrievedAt).toLocaleDateString()})
            </span>
          </div>

          <div className="truncate">
            <strong className="text-neutral-200">API Endpoint:</strong>{' '}
            <a
              href={provenance.endpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline break-all"
            >
              {provenance.endpoint}
            </a>
          </div>

          <p className="text-[10px] text-neutral-500 pt-1">
            * 100% Authentic Policy: Telemetry & statistics are sourced strictly from genuine API endpoints. No synthetic jitter or placeholder numbers are generated.
          </p>
        </div>
      )}
    </div>
  )
}

