import React from 'react'
import { motion } from 'framer-motion'

interface ShutdownScreenProps {
  onPowerOn: () => void
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onPowerOn }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020306] select-none text-slate-400 p-6"
    >
      <div className="flex flex-col items-center space-y-6 text-center max-w-xs">
        {/* Hardware-style Power On Button */}
        <motion.button
          type="button"
          onClick={onPowerOn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Power On Workspace"
          className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 flex items-center justify-center shadow-2xl shadow-black transition-all cursor-pointer group"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors group-hover:text-cyan-400"
            aria-hidden="true"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </motion.button>

        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
            Workspace Powered Off
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Click the power button to start
          </p>
        </div>
      </div>
    </motion.div>
  )
}
