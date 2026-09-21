import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  ExternalLink,
  Globe,
  Loader2,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react'
import type { WindowState } from '@/types'

interface BrowserAppProps {
  windowState: WindowState
}

/**
 * BrowserApp
 * Windows-inspired Chrome-style portfolio browser window app.
 * Features:
 * - Embedded iframe rendering
 * - Address bar with live URL
 * - Back, Forward, Refresh navigation controls
 * - Subtle loading state
 * - Clean in-window fallback card for sites with X-Frame-Options / CSP framing restrictions
 * - Single-instance window management compatibility
 */
export const BrowserApp: React.FC<BrowserAppProps> = ({ windowState }) => {
  const targetUrl = windowState.metadata?.liveUrl || 'https://quickwayride.com'
  const title = windowState.metadata?.title || windowState.title || 'Browser'

  const [isLoading, setIsLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Reset states when target URL changes
  useEffect(() => {
    setIsLoading(true)
    setIsBlocked(false)
  }, [targetUrl, iframeKey])

  // Safety timer if iframe takes too long or is silently blocked by X-Frame-Options
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [isLoading, iframeKey])

  const handleRefresh = () => {
    setIsLoading(true)
    setIsBlocked(false)
    setIframeKey((prev) => prev + 1)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-transparent text-slate-100 overflow-hidden select-none font-sans">
      {/* Chrome-Style Portfolio Browser Toolbar */}
      <div className="h-11 px-3 bg-slate-900/40 border-b border-white/8 flex items-center justify-between gap-2 shrink-0 backdrop-blur-sm">
        {/* Left Navigation Buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleRefresh}
            title="Back"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            disabled
            title="Forward"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-600 cursor-not-allowed"
          >
            <ArrowRight size={15} />
          </button>
          <button
            onClick={handleRefresh}
            title="Reload website"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
          </button>
        </div>

        {/* Center Address Bar */}
        <div className="flex-1 min-w-[180px] max-w-xl h-8 px-3 rounded-full bg-black/40 border border-white/12 flex items-center justify-between space-x-2 text-xs text-slate-300 shadow-inner group">
          <div className="flex items-center space-x-2 overflow-hidden truncate">
            <Lock size={12} className="text-emerald-400 shrink-0" />
            <span className="truncate font-mono text-[11px] text-slate-200 select-all">
              {targetUrl}
            </span>
          </div>

          <button
            onClick={handleCopyUrl}
            title="Copy URL"
            className="text-slate-400 hover:text-white shrink-0 p-0.5 rounded cursor-pointer transition"
          >
            {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>

        {/* Right Open Tab Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsBlocked((prev) => !prev)}
            title={isBlocked ? 'View iframe stream' : 'Show embedding info'}
            className="px-2.5 py-1 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Globe size={13} className="text-cyan-400" />
            <span className="hidden sm:inline text-[11px]">Preview Info</span>
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open website in new browser tab"
            className="px-3 py-1 rounded-[var(--radius-control)] bg-cyan-500 hover:bg-cyan-400 text-xs font-medium text-slate-950 flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Open Tab</span>
          </a>
        </div>
      </div>

      {/* Main Website Viewport Container */}
      <div className="flex-1 w-full h-full relative bg-slate-950/60 overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && !isBlocked && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-3">
            <Loader2 size={32} className="text-cyan-400 animate-spin stroke-[2]" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white tracking-wide">
                Loading {title}...
              </p>
              <p className="text-xs font-mono text-slate-400">
                {targetUrl}
              </p>
            </div>
          </div>
        )}

        {/* In-Window Fallback View (When Frame Embedding is restricted by X-Frame-Options/CSP) */}
        {isBlocked ? (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 sm:p-10 space-y-5 select-none">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl">
              <ShieldAlert size={32} />
            </div>

            <div className="max-w-md space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                X-Frame-Options Protected
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight pt-1">
                {title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                This website restricts third-party embedded iframe previews for security reasons (<code className="text-cyan-300 font-mono">X-Frame-Options: SAMEORIGIN</code>).
              </p>
              <p className="text-xs font-mono text-slate-400 pt-1">
                {targetUrl}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-[var(--radius-control)] bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-slate-950 flex items-center space-x-2 transition cursor-pointer shadow-md"
              >
                <ExternalLink size={14} />
                <span>Open {title} Live Site</span>
              </a>

              <button
                onClick={() => {
                  setIsBlocked(false)
                  handleRefresh()
                }}
                className="px-4 py-2 rounded-[var(--radius-control)] bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-200 transition cursor-pointer"
              >
                Retry Iframe
              </button>
            </div>
          </div>
        ) : (
          /* Live Embedded Iframe */
          <iframe
            key={iframeKey}
            src={targetUrl}
            title={title}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setIsBlocked(true)
            }}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  )
}
