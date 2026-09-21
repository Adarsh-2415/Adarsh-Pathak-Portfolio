import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StartupNodeAnimation } from './StartupNodeAnimation'

interface StartupScreenProps {
  onComplete: () => void
  durationMs?: number
}

const STARTUP_STEPS = [
  { id: 'init', text: 'Initializing workspace...' },
  { id: 'load', text: 'Loading interface...' },
  { id: 'env', text: 'Preparing environment...' },
  { id: 'ready', text: 'Workspace ready' },
]

/**
 * StartupScreen — First Screen on Website Open
 * Refined Windows-inspired developer workspace boot experience.
 * Displays "ADARSH PATHAK / PORTFOLIO ENVIRONMENT" with an abstract
 * connected-node technical visualization, progressive status sequence,
 * and a refined thin horizontal progress bar.
 */
export const StartupScreen: React.FC<StartupScreenProps> = ({
  onComplete,
  durationMs = 2800,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start progress animation
    const progressTimer = setTimeout(() => {
      setProgress(100)
    }, 40)

    // Sequential status text transitions across the duration
    const stepInterval = (durationMs - 350) / STARTUP_STEPS.length
    const intervals: Array<ReturnType<typeof setTimeout>> = []

    for (let i = 1; i < STARTUP_STEPS.length; i++) {
      const t = setTimeout(() => {
        setCurrentStepIndex(i)
      }, i * stepInterval)
      intervals.push(t)
    }

    // Complete startup sequence after workspace ready settles
    const completionTimer = setTimeout(() => {
      onComplete()
    }, durationMs)

    return () => {
      clearTimeout(progressTimer)
      clearTimeout(completionTimer)
      intervals.forEach(clearTimeout)
    }
  }, [onComplete, durationMs])

  const currentStep = STARTUP_STEPS[currentStepIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-between select-none p-6 sm:p-10 bg-[#05070d]/85 backdrop-blur-[2px] text-slate-100 overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* Top Header Placeholder (for vertical balance) */}
      <div className="w-full opacity-0 pointer-events-none" aria-hidden="true">
        <span className="text-4xl font-light">00:00</span>
      </div>

      {/* Center: System Identity, Technical Node Animation & Progress */}
      <main className="w-full max-w-sm flex flex-col items-center text-center my-auto py-4 z-10">
        {/* Startup Identity: Distinct from Sign-In Screen */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-lg sm:text-xl font-semibold tracking-wider text-slate-100 uppercase font-sans">
            ADARSH PATHAK
          </h1>
          <p className="text-xs font-medium text-cyan-400/80 tracking-widest uppercase mt-1 font-mono">
            PORTFOLIO ENVIRONMENT
          </p>
        </div>

        {/* Abstract Technical Architecture Visualization */}
        <div className="my-2 mb-6">
          <StartupNodeAnimation stepIndex={currentStepIndex} />
        </div>

        {/* Refined Windows 11 Thin Horizontal Progress Line */}
        <div className="w-60 max-w-full space-y-2.5 flex flex-col items-center">
          <div className="w-full h-[2px] rounded-full bg-white/10 overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: durationMs / 1000 - 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            />
          </div>

          {/* Sequential Status Text with Subtle Fade/Slide */}
          <div className="h-5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep.id}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="text-xs text-slate-400 font-sans tracking-wide"
              >
                {currentStep.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Footer: System Context */}
      <footer className="w-full flex items-center justify-between text-[11px] text-slate-500 z-10">
        <span className="tracking-wide font-sans">Adarsh Pathak Portfolio Environment</span>
        <span className="font-mono tracking-wider">
          {currentStepIndex === STARTUP_STEPS.length - 1 ? 'Ready' : 'Initializing...'}
        </span>
      </footer>
    </motion.div>
  )
}
