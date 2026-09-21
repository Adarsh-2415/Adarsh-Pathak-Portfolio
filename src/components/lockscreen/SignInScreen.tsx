import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProfileMonogram } from './ProfileMonogram'
import { VisitorNameInput } from './VisitorNameInput'
import { PowerControl } from './PowerControl'

interface SignInScreenProps {
  onSubmitName: (name: string) => void
  onSleep: () => void
  onRestart: () => void
  onShutdown: () => void
  disabled?: boolean
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSubmitName,
  onSleep,
  onRestart,
  onShutdown,
  disabled = false,
}) => {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      )
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      )
    }
    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-between select-none p-6 sm:p-10 overflow-hidden"
    >
      {/* Top Header: Responsive Clock & Date */}
      <header className="w-full flex justify-between items-start text-left z-20 pointer-events-none">
        <div className="flex flex-col drop-shadow-md">
          <span className="text-4xl sm:text-5xl font-light tracking-tight text-slate-100 font-sans">
            {currentTime}
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
            {currentDate}
          </span>
        </div>
      </header>

      {/* Center: System Account Profile & Name Entry */}
      <main className="w-full max-w-sm flex flex-col items-center text-center my-auto py-4 z-20">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-col items-center mb-6"
        >
          <ProfileMonogram size="lg" className="mb-5 drop-shadow-2xl" />

          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-100 font-sans drop-shadow-md">
            ADARSH PATHAK
          </h2>
          <p className="text-xs font-medium text-slate-400 tracking-wider uppercase mt-1 font-mono">
            Personal Workspace
          </p>
        </motion.div>

        {/* Name Input & Enter Button */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          className="w-full flex flex-col items-center"
        >
          <VisitorNameInput onSubmit={onSubmitName} disabled={disabled} />
        </motion.div>
      </main>

      {/* Bottom Footer: Workspace Brand & Windows 11 Power Control */}
      <footer className="w-full flex items-center justify-between text-xs text-slate-400 z-20">
        <span className="text-[11px] text-slate-400 tracking-wide font-sans drop-shadow-sm">
          Personal Workspace
        </span>

        {/* Windows-inspired Power Menu Control */}
        <PowerControl
          onSleep={onSleep}
          onRestart={onRestart}
          onShutdown={onShutdown}
        />
      </footer>
    </motion.div>
  )
}
