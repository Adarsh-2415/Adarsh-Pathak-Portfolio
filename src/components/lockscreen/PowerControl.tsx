import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PowerControlProps {
  onSleep: () => void
  onRestart: () => void
  onShutdown: () => void
}

export const PowerControl: React.FC<PowerControlProps> = ({
  onSleep,
  onRestart,
  onShutdown,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Outside click and Escape key dismissal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left">
      {/* Windows 11 Power Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Power options"
        title="Power"
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 border ${
          isOpen
            ? 'bg-white/15 border-white/20 text-slate-100 ring-2 ring-[var(--accent-subtle)]'
            : 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/10 text-slate-300 hover:text-white'
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      </button>

      {/* Contextual Windows 11 Power Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="menu"
            aria-orientation="vertical"
            className="absolute bottom-11 right-0 w-44 rounded-xl surface-menu p-1.5 shadow-2xl border border-white/10 z-50 select-none text-xs"
          >
            {/* Sleep option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                onSleep()
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/15 transition text-left cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-400"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Sleep</span>
            </button>

            {/* Restart option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                onRestart()
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/15 transition text-left cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-400"
                aria-hidden="true"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Restart</span>
            </button>

            <div className="my-1 border-t border-white/[0.06]" />

            {/* Shut down option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                onShutdown()
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 active:bg-rose-500/25 transition text-left cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
              <span>Shut down</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
