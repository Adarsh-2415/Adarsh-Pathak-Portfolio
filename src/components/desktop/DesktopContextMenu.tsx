import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowDownAZ, LayoutGrid, CheckSquare, Layers } from 'lucide-react'

export interface ContextMenuPosition {
  x: number
  y: number
}

interface DesktopContextMenuProps {
  position: ContextMenuPosition | null
  onClose: () => void
  onRefresh: () => void
  onSortByName: () => void
  onSortByType: () => void
  onToggleIconSize: () => void
  onSelectAll: () => void
  isLargeIcons: boolean
}

/**
 * DesktopContextMenu
 * Authentic Windows 11-inspired right-click context menu.
 * Contains strictly functional actions (no fake settings dialogs).
 */
export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  position,
  onClose,
  onRefresh,
  onSortByName,
  onSortByType,
  onToggleIconSize,
  onSelectAll,
  isLargeIcons,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
  }, [onClose])

  if (!position) return null

  // Clamping within viewport
  const menuWidth = 210
  const menuHeight = 220
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 800

  const safeX = Math.min(position.x, screenW - menuWidth - 10)
  const safeY = Math.min(position.y, screenH - menuHeight - 58) // 58px safe margin above taskbar

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{ left: `${safeX}px`, top: `${safeY}px` }}
      className="fixed z-[980] w-[210px] surface-menu rounded-[var(--radius-popup)] p-1.5 text-xs text-slate-200 select-none shadow-2xl border border-white/10"
      role="menu"
      aria-label="Desktop context menu"
    >
      {/* Refresh */}
      <button
        onClick={() => {
          onRefresh()
          onClose()
        }}
        className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400"
        role="menuitem"
      >
        <RefreshCw size={14} className="text-cyan-400" />
        <span className="font-sans">Refresh Desktop</span>
      </button>

      <div className="my-1 h-[1px] bg-white/10" role="separator" />

      {/* View Options */}
      <button
        onClick={() => {
          onToggleIconSize()
          onClose()
        }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-control)] hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400"
        role="menuitem"
      >
        <div className="flex items-center space-x-2.5 font-sans">
          <LayoutGrid size={14} className="text-slate-400" />
          <span>Large Icons</span>
        </div>
        {isLargeIcons && <span className="text-[10px] text-cyan-400 font-bold">✓</span>}
      </button>

      <div className="my-1 h-[1px] bg-white/10" role="separator" />

      {/* Sort Options */}
      <button
        onClick={() => {
          onSortByName()
          onClose()
        }}
        className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400"
        role="menuitem"
      >
        <ArrowDownAZ size={14} className="text-slate-400" />
        <span className="font-sans">Sort by Name</span>
      </button>

      <button
        onClick={() => {
          onSortByType()
          onClose()
        }}
        className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400"
        role="menuitem"
      >
        <Layers size={14} className="text-slate-400" />
        <span className="font-sans">Sort by Type</span>
      </button>

      <div className="my-1 h-[1px] bg-white/10" role="separator" />

      {/* Select All */}
      <button
        onClick={() => {
          onSelectAll()
          onClose()
        }}
        className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400"
        role="menuitem"
      >
        <CheckSquare size={14} className="text-slate-400" />
        <span className="font-sans">Select All</span>
      </button>
    </motion.div>
  )
}
