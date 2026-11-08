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
        return 'text-[#FED500] bg-amber-950/40 border-amber-500/40'
      case 'UNAVAILABLE':
      default:
        return 'text-rose-400 bg-rose-950/40 border-rose-500/40'
    }
  }

  const getFreshnessColor = (status: ProvenanceMetadata['freshnessStatus']) => {
    switch (status) {
      case 'LIVE':
        return 'text-white bg-[#E10600] border-[#E10600] animate-pulse font-black'
      case 'HISTORICAL':
        return 'text-[#D8D8D8] bg-[#111111] border-[#292929]'
      case 'STALE':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/40'
      case 'DEMO':
        return 'text-purple-400 bg-purple-950/40 border-purple-500/40 font-bold'
      case 'CONNECTING':
        return 'text-sky-400 bg-sky-950/40 border-sky-500/40 animate-pulse'
      case 'UNAVAILABLE':
      default:
        return 'text-[#858585] bg-[#0A0A0A] border-[#222222]'
    }
  }

  return (
    <div
      className={`border rounded-none p-3 bg-[#0B0D14] transition-colors font-mono ${className} ${
        provenance.freshnessStatus === 'LIVE' ? 'border-[#E10600]/80' : 'border-[#292929]'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            {provenance.freshnessStatus === 'LIVE' ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-[#E10600] opacity-75"></span>
                <span className="relative inline-flex rounded-none h-2 w-2 bg-[#E10600]"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-none h-2 w-2 bg-[#555555]"></span>
            )}
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-none border uppercase ${getVerificationColor(
              provenance.verificationStatus
            )}`}
          >
            {provenance.verificationStatus.replace('_', ' ')}
          </span>

          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded-none border uppercase ${getFreshnessColor(
              provenance.freshnessStatus
            )}`}
          >
            {provenance.freshnessStatus}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] font-mono text-[#858585] hover:text-white px-2 py-0.5 rounded-none bg-[#111111] hover:bg-[#1A1A1A] border border-[#292929] hover:border-[#E10600] transition uppercase"
          >
            {expanded ? 'Hide Source' : 'Audit Trace'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-2.5 border-t border-[#222222] text-[10px] font-mono space-y-1 text-[#858585]">
          <div className="flex flex-wrap gap-x-4">
            <span>
              <strong className="text-white">Provider:</strong> {provenance.provider}
            </span>
            {provenance.sessionKey && (
              <span>
                <strong className="text-white">Session Key:</strong> {provenance.sessionKey}
              </span>
            )}
            <span>
              <strong className="text-white">Retrieved:</strong>{' '}
              {new Date(provenance.retrievedAt).toLocaleTimeString()} (UTC {new Date(provenance.retrievedAt).toLocaleDateString()})
            </span>
          </div>

          <div className="truncate">
            <strong className="text-white">API Endpoint:</strong>{' '}
            <a
              href={provenance.endpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline break-all"
            >
              {provenance.endpoint}
            </a>
          </div>

          <p className="text-[9px] text-[#666666] pt-1 uppercase">
            * 100% Authentic Policy: Telemetry & statistics are sourced strictly from genuine API endpoints. No synthetic jitter or placeholder numbers are generated.
          </p>
        </div>
      )}
    </div>
  )
}

export default DataProvenanceBadge
