import React from 'react'
import type { WindowState } from '@/types'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'

interface WindowPlaceholderContentProps {
  windowState: WindowState
}

/**
 * WindowPlaceholderContent
 * Strictly structural placeholder for Phase 3 window management.
 * Note: Zero fake metrics, fake statistics, fake download links, or fake tags.
 * Full specialized application experiences belong to subsequent phases.
 */
export const WindowPlaceholderContent: React.FC<WindowPlaceholderContentProps> = ({
  windowState,
}) => {
  return (
    <div className="flex-1 w-full h-full flex flex-col p-6 text-slate-200 select-none overflow-auto">
      {/* Structural Header */}
      <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
        <div className="w-12 h-12 rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center shadow-inner">
          {resolveVfsIcon(windowState.iconType as any, 36)}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-wide font-sans">
            {windowState.title}
          </h2>
          <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-cyan-400">
              Handler: {windowState.appId}
            </span>
            <span>•</span>
            <span className="text-slate-400">Window ID: {windowState.id}</span>
          </div>
        </div>
      </div>

      {/* Structural Application Workspace Frame */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 my-auto space-y-3">
        <div className="w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-sm font-mono">
          SYS
        </div>
        <div className="max-w-md space-y-1">
          <p className="text-sm font-medium text-slate-200 font-sans">
            {windowState.title} Component Frame
          </p>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Window manager foundation active. Dedicated application view will be implemented in subsequent phases.
          </p>
        </div>
      </div>

      {/* Structural Status Bar */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Ready</span>
        <span>Z-Index: {windowState.zIndex}</span>
      </div>
    </div>
  )
}
