import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Wifi } from 'lucide-react'
import { useSessionStore } from '@/store/useSessionStore'
import { useWindowStore } from '@/store/useWindowStore'
import { CalendarPanel } from './CalendarPanel'

/**
 * SystemTray
 * Authentic Windows 11-inspired system tray.
 * Features: Live auto-updating clock & date, audio toggle, connection indicator,
 * interactive Calendar popup panel, and desktop peek sliver.
 */
export const SystemTray: React.FC = () => {
  const [timeStr, setTimeStr] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [fullDateStr, setFullDateStr] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { isSoundEnabled, toggleSound } = useSessionStore()
  const { windows, minimizeWindow, restoreWindow } = useWindowStore()

  // Real-time browser clock & date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Time: e.g. 10:45 PM
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

      // Date: e.g. 9/11/2026
      const formattedDate = now.toLocaleDateString([], {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      })

      // Full descriptive date for tooltip
      const formattedFull = now.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      setTimeStr(formattedTime)
      setDateStr(formattedDate)
      setFullDateStr(formattedFull)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Desktop Peek: Toggle minimize all windows
  const handleDesktopPeek = () => {
    const hasVisible = windows.some((w) => w.isOpen && !w.isMinimized)
    if (hasVisible) {
      windows.forEach((w) => {
        if (w.isOpen && !w.isMinimized) minimizeWindow(w.id)
      })
    } else {
      windows.forEach((w) => {
        if (w.isOpen && w.isMinimized) restoreWindow(w.id)
      })
    }
  }

  return (
    <div className="flex items-center h-full space-x-1 select-none text-slate-300 relative">
      {/* Quick Status Pill (Audio & Network) */}
      <div className="flex items-center space-x-1.5 px-2 py-1 rounded-[var(--radius-control)] hover:bg-white/10 transition-colors">
        {/* Network status */}
        <div title="Workspace Environment: Online" className="flex items-center">
          <Wifi size={14} className="text-cyan-400" />
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          title={isSoundEnabled ? 'Audio: Enabled' : 'Audio: Muted'}
          aria-label="Toggle system audio"
          className="hover:text-white transition-colors cursor-pointer"
        >
          {isSoundEnabled ? (
            <Volume2 size={14} className="text-slate-300" />
          ) : (
            <VolumeX size={14} className="text-slate-500" />
          )}
        </button>
      </div>

      {/* Live Clock & Date Button */}
      <button
        onClick={() => setIsCalendarOpen((prev) => !prev)}
        title={fullDateStr}
        aria-label="Open system calendar"
        className="flex flex-col items-end justify-center px-2 py-0.5 rounded-[var(--radius-control)] hover:bg-white/10 transition-colors cursor-pointer text-[11px] leading-[13px] font-sans border border-transparent focus-visible:border-cyan-400 outline-none"
      >
        <span className="font-medium text-slate-200">{timeStr || '00:00'}</span>
        <span className="text-[10px] text-slate-400">{dateStr || '0/0/0000'}</span>
      </button>

      {/* Windows 11 Desktop Peek Sliver */}
      <button
        onClick={handleDesktopPeek}
        title="Show Desktop"
        aria-label="Show Desktop"
        className="w-1.5 h-7 ml-1 border-l border-white/15 hover:bg-white/20 transition-colors cursor-pointer"
      />

      {/* Interactive Calendar Popup Panel */}
      <AnimatePresence>
        {isCalendarOpen && (
          <CalendarPanel
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
