import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ProfileMonogram } from './ProfileMonogram'

interface WorkspacePreparationProps {
  visitorName: string
  onComplete: () => void
  durationMs?: number
}

/**
 * WorkspacePreparation — Post-name entry transition
 * Displays "WELCOME, [VISITOR NAME]" followed by "Preparing workspace..."
 * with an elegant ambient progress transition for ~2.2 seconds.
 */
export const WorkspacePreparation: React.FC<WorkspacePreparationProps> = ({
  visitorName,
  onComplete,
  durationMs = 2200,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start smooth progress line fill
    const progressTimer = setTimeout(() => {
      setProgress(100)
    }, 40)

    const timer = setTimeout(() => {
      onComplete()
    }, durationMs)

    return () => {
      clearTimeout(progressTimer)
      clearTimeout(timer)
    }
  }, [onComplete, durationMs])

  const cleanName = visitorName?.trim()
  const greeting = cleanName ? `WELCOME, ${cleanName.toUpperCase()}` : 'WELCOME'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/25 backdrop-blur-[2px] text-slate-100 select-none p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center space-y-6 text-center max-w-sm w-full">
        {/* Profile Avatar with subtle breathing presence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <ProfileMonogram size="md" className="shadow-[0_12px_36px_rgba(0,0,0,0.5)]" />
        </motion.div>

        {/* Personalized Welcome Headline & Preparation Status */}
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="text-xl sm:text-2xl font-semibold tracking-wider text-slate-100 uppercase font-sans"
          >
            {greeting}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
            className="text-xs sm:text-sm text-slate-400 font-sans tracking-wide"
          >
            Preparing workspace...
          </motion.p>
        </div>

        {/* Refined Thin Ambient Progress Line (No generic spinner) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="w-56 max-w-full space-y-2 flex flex-col items-center pt-2"
        >
          <div className="w-full h-[2px] rounded-full bg-white/10 overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: durationMs / 1000 - 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
