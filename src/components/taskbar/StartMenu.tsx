import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Power, Moon, RotateCcw, PowerOff, ChevronRight } from 'lucide-react'
import { vfsRootNodes } from '@/data/vfs'
import type { VFSNode } from '@/types'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'
import { ProfileMonogram } from '@/components/lockscreen/ProfileMonogram'
import { useSessionStore } from '@/store/useSessionStore'
import { useWindowStore } from '@/store/useWindowStore'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenSearch: () => void
  onSleep: () => void
  onRestart: () => void
  onShutdown: () => void
}

/**
 * StartMenu
 * Windows 11-inspired centered Start Menu for Adarsh Pathak — Personal Workspace.
 * Pinned items are derived directly from authentic VFS data.
 * Power actions align with the approved system states: Sleep, Restart, Shut down.
 */
export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onSleep,
  onRestart,
  onShutdown,
}) => {
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const powerMenuRef = useRef<HTMLDivElement>(null)

  const { visitorName } = useSessionStore()
  const openWindow = useWindowStore((state) => state.openWindow)

  // Filter pinned items from authentic VFS nodes (Recycle Bin is desktop-only)
  const pinnedNodes = vfsRootNodes.filter((node) =>
    [
      'node-this-pc',
      'file-about',
      'file-resume',
      'file-contact',
      'folder-design',
      'folder-website',
      'folder-ai-graphic',
      'folder-ai-video',
    ].includes(node.id)
  )

  // Outside click & Escape listener
  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen, onClose])

  const handleLaunchNode = (node: VFSNode) => {
    openWindow({
      id: `win-${node.id}`,
      appId: node.appHandler,
      title: node.name,
      iconType: node.iconType,
      metadata: node.metadata,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[950] w-[95vw] max-w-[540px] max-h-[620px] surface-menu rounded-[var(--radius-window)] flex flex-col overflow-hidden text-slate-100 shadow-2xl select-none"
      role="dialog"
      aria-label="Start menu"
    >
      {/* Search Bar Shortcut */}
      <div className="p-5 pb-3">
        <button
          onClick={() => {
            onClose()
            onOpenSearch()
          }}
          className="w-full h-10 px-4 rounded-full bg-black/35 hover:bg-black/55 border border-white/12 flex items-center text-xs text-slate-300 hover:text-white transition-all text-left cursor-pointer shadow-inner"
        >
          <svg className="w-4 h-4 mr-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search projects, skills, and documents...</span>
        </button>
      </div>

      {/* Pinned Section Header */}
      <div className="px-6 pt-2 pb-1 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-mono">
          Pinned Destinations
        </span>
        <span className="text-[11px] text-cyan-400 font-medium">Workspace Items</span>
      </div>

      {/* Pinned Items Grid (Authentic VFS Data) */}
      <div className="px-5 py-3 grid grid-cols-4 gap-3">
        {pinnedNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => handleLaunchNode(node)}
            className="group flex flex-col items-center p-2.5 rounded-[var(--radius-control)] bg-white/[0.03] hover:bg-white/[0.09] border border-white/[0.04] hover:border-white/10 transition-all cursor-pointer text-center shadow-xs backdrop-blur-xs"
          >
            <div className="w-10 h-10 flex items-center justify-center pointer-events-none drop-shadow-sm group-hover:scale-105 transition-transform duration-150">
              {resolveVfsIcon(node.iconType, 36)}
            </div>
            <span className="mt-2 text-[11px] font-sans text-slate-200 group-hover:text-white line-clamp-1">
              {node.name}
            </span>
          </button>
        ))}
      </div>

      {/* Recommended Section (Authentic VFS Shortcuts) */}
      <div className="px-6 pt-3 pb-1 border-t border-white/8 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-mono">
          Recommended
        </span>
        <span className="text-[11px] text-slate-400 font-mono">Authentic VFS</span>
      </div>

      <div className="px-5 py-2 space-y-1 overflow-y-auto max-h-[140px]">
        {vfsRootNodes.slice(0, 3).map((node) => (
          <button
            key={node.id}
            onClick={() => handleLaunchNode(node)}
            className="w-full flex items-center justify-between p-2 rounded-[var(--radius-control)] bg-white/[0.03] hover:bg-white/[0.09] border border-white/[0.04] hover:border-white/8 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {resolveVfsIcon(node.iconType, 22)}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">{node.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{node.metadata?.description || node.type}</p>
              </div>
            </div>
            <ChevronRight size={12} className="text-slate-500 shrink-0 ml-2" />
          </button>
        ))}
      </div>

      {/* Start Menu Footer (Profile Identity & Power Actions) */}
      <footer className="relative mt-auto p-4 px-6 bg-black/35 border-t border-white/10 flex items-center justify-between">
        {/* User Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/15">
            <ProfileMonogram size="sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white tracking-wide">
              {visitorName || 'Guest Visitor'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Adarsh Pathak Workspace
            </span>
          </div>
        </div>

        {/* Power Controls Button */}
        <div className="relative">
          <button
            onClick={() => setIsPowerMenuOpen((prev) => !prev)}
            title="Power options"
            aria-label="Power options"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Power size={17} />
          </button>

          {/* Power Options Dropup Menu */}
          <AnimatePresence>
            {isPowerMenuOpen && (
              <motion.div
                ref={powerMenuRef}
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 bottom-11 w-38 surface-menu rounded-[var(--radius-popup)] p-1.5 shadow-2xl text-xs z-50 space-y-0.5"
              >
                <button
                  onClick={() => {
                    setIsPowerMenuOpen(false)
                    onClose()
                    onSleep()
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[var(--radius-control)] hover:bg-white/10 text-slate-200 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Moon size={14} className="text-sky-400" />
                  <span>Sleep</span>
                </button>

                <button
                  onClick={() => {
                    setIsPowerMenuOpen(false)
                    onClose()
                    onRestart()
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[var(--radius-control)] hover:bg-white/10 text-slate-200 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <RotateCcw size={14} className="text-cyan-400" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={() => {
                    setIsPowerMenuOpen(false)
                    onClose()
                    onShutdown()
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[var(--radius-control)] hover:bg-white/10 text-rose-300 hover:text-rose-200 transition-colors text-left cursor-pointer"
                >
                  <PowerOff size={14} className="text-rose-400" />
                  <span>Shut down</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </motion.div>
  )
}
