import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [viewDate, setViewDate] = useState<Date>(new Date())
  const panelRef = useRef<HTMLDivElement>(null)

  // Real-time clock update for the panel header
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Keep viewDate synced with current month on open
  useEffect(() => {
    if (isOpen) {
      setViewDate(new Date())
    }
  }, [isOpen])

  // Dismiss on outside click or Escape
  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Calendar math
  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate()

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1))
  }

  const isCurrentMonth =
    currentDate.getFullYear() === viewYear && currentDate.getMonth() === viewMonth
  const todayDate = currentDate.getDate()

  const monthName = viewDate.toLocaleDateString([], { month: 'long', year: 'numeric' })
  const timeStr = currentDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const fullDateStr = currentDate.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Days grid generation
  const gridCells = []

  // Leading days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push({
      day: d,
      isCurrentMonth: true,
      isToday: isCurrentMonth && d === todayDate,
    })
  }

  // Trailing days for next month
  const totalSlots = Math.ceil(gridCells.length / 7) * 7
  const trailingCount = totalSlots - gridCells.length
  for (let t = 1; t <= trailingCount; t++) {
    gridCells.push({
      day: t,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 right-3 z-[950] w-[320px] surface-menu rounded-[var(--radius-window)] p-4 text-slate-100 shadow-2xl select-none border border-white/10"
      role="dialog"
      aria-label="System Calendar"
    >
      {/* Top Header: Live Time & Descriptive Full Date */}
      <div className="pb-3 border-b border-white/10 space-y-0.5">
        <div className="text-2xl font-light text-white tracking-tight font-sans">
          {timeStr}
        </div>
        <div className="text-xs text-cyan-400 font-medium font-sans truncate">
          {fullDateStr}
        </div>
      </div>

      {/* Month Navigation Header */}
      <div className="pt-3 pb-2 flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-200 tracking-wide font-sans">
          {monthName}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevMonth}
            title="Previous month"
            aria-label="Previous month"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            title="Next month"
            aria-label="Next month"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-slate-400 py-1 font-mono">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Dynamic Days Grid */}
      <div className="grid grid-cols-7 gap-1 pt-1 text-xs">
        {gridCells.map((cell, idx) => (
          <div
            key={idx}
            className={`h-8 rounded-[var(--radius-control)] flex items-center justify-center font-sans text-xs transition-colors ${
              cell.isToday
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300'
                : cell.isCurrentMonth
                ? 'text-slate-200 hover:bg-white/10 cursor-pointer'
                : 'text-slate-600'
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
