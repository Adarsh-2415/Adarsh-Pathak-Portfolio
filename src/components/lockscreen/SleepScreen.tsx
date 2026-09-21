import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

interface SleepScreenProps {
  onWake: () => void
}

export const SleepScreen: React.FC<SleepScreenProps> = ({ onWake }) => {
  useEffect(() => {
    const handleKeyDown = () => {
      onWake()
    }

    const handleClick = () => {
      onWake()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handleClick)
    }
  }, [onWake])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030408] select-none text-slate-400 cursor-pointer p-6"
      role="button"
      tabIndex={0}
      aria-label="Workspace sleeping. Click or press any key to wake."
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Subtle breathing crescent moon icon */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-full bg-slate-900/80 border border-white/5 flex items-center justify-center text-indigo-400"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </motion.div>

        <div className="space-y-1">
          <h2 className="text-sm font-medium tracking-wider text-slate-300 uppercase">
            Personal Workspace
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Sleeping...
          </p>
        </div>

        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[11px] text-slate-500 tracking-wide pt-4"
        >
          Click anywhere or press any key to wake
        </motion.p>
      </div>
    </motion.div>
  )
}
