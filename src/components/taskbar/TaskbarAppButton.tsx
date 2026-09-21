import React from 'react'
import type { WindowState } from '@/types'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'

interface TaskbarAppButtonProps {
  window: WindowState
  onClick: () => void
}

/**
 * TaskbarAppButton
 * Windows 11-inspired taskbar running application icon.
 * Features: active status pill vs running dot indicator, hover elevation,
 * and click-to-minimize/restore.
 */
export const TaskbarAppButton: React.FC<TaskbarAppButtonProps> = ({ window: win, onClick }) => {
  return (
    <button
      onClick={onClick}
      title={win.title}
      aria-label={`${win.title} application window`}
      className={`group relative h-10 px-2.5 rounded-[var(--radius-control)] flex items-center justify-center transition-all duration-150 cursor-pointer ${
        win.isFocused && !win.isMinimized
          ? 'bg-white/12 text-white'
          : 'hover:bg-white/8 text-slate-300'
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow-sm">
        {resolveVfsIcon(win.iconType as any, 22)}
      </div>

      {/* Windows 11 Active / Running Status Indicator Bar */}
      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center pointer-events-none">
        {win.isFocused && !win.isMinimized ? (
          <span className="w-4 h-[3px] bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
        ) : (
          <span className="w-1.5 h-[2px] bg-slate-400 rounded-full opacity-80" />
        )}
      </div>
    </button>
  )
}
