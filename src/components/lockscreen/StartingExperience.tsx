import React, { useState, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StartupScreen } from './StartupScreen'
import { SignInScreen } from './SignInScreen'
import { WorkspacePreparation } from './WorkspacePreparation'
import { SleepScreen } from './SleepScreen'
import { ShutdownScreen } from './ShutdownScreen'
import { AmbientFallbackBackground } from '@/components/background/AmbientFallbackBackground'
import { DesktopWallpaperBackground } from '@/components/background/DesktopWallpaperBackground'
import { useSessionStore } from '@/store/useSessionStore'

const Ambient3DBackground = lazy(() =>
  import('@/components/background/Ambient3DBackground').then((m) => ({
    default: m.Ambient3DBackground,
  }))
)

export type SystemStage =
  | 'startup'
  | 'signin'
  | 'preparing'
  | 'sleeping'
  | 'restarting'
  | 'shuttingdown'
  | 'poweredoff'

interface StartingExperienceProps {
  onHandoff: () => void
}

export const StartingExperience: React.FC<StartingExperienceProps> = ({ onHandoff }) => {
  const [stage, setStage] = useState<SystemStage>('startup')
  const { visitorName, setVisitorName } = useSessionStore()

  // Transitions
  const handleStartupComplete = () => {
    setStage('signin')
  }

  const handleNameSubmit = (name: string) => {
    setVisitorName(name)
    setStage('preparing')
  }

  const handlePreparationComplete = () => {
    onHandoff()
  }

  // Power Menu Actions
  const handleSleep = () => {
    setStage('sleeping')
  }

  const handleWake = () => {
    setStage('signin')
  }

  const handleRestart = () => {
    setStage('restarting')
    setTimeout(() => {
      setVisitorName('') // Clear visitor session on workspace restart
      setStage('startup')
    }, 1200)
  }

  const handleShutdown = () => {
    setStage('shuttingdown')
    setTimeout(() => {
      setStage('poweredoff')
    }, 1300)
  }

  const handlePowerOn = () => {
    setStage('startup')
  }

  const isDimmedBackground = stage === 'sleeping' || stage === 'shuttingdown' || stage === 'poweredoff'

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#05070e]">
      {/* Startup Screen keeps existing 3D background treatment; Sign-In & Welcome screens use wallpaper */}
      {stage === 'startup' ? (
        <Suspense fallback={<AmbientFallbackBackground />}>
          <Ambient3DBackground isDimmed={isDimmedBackground} />
        </Suspense>
      ) : (
        <DesktopWallpaperBackground
          isDimmed={isDimmedBackground}
          isBlurred={stage === 'signin'}
        />
      )}

      <AnimatePresence mode="wait">
        {/* Stage 1: System Boot Experience */}
        {stage === 'startup' && (
          <StartupScreen
            key="startup"
            onComplete={handleStartupComplete}
            durationMs={2800}
          />
        )}

        {/* Stage 2: Windows-Inspired Sign-In */}
        {stage === 'signin' && (
          <SignInScreen
            key="signin"
            onSubmitName={handleNameSubmit}
            onSleep={handleSleep}
            onRestart={handleRestart}
            onShutdown={handleShutdown}
          />
        )}

        {/* Stage 3: Short Personalized Post-Name Transition */}
        {stage === 'preparing' && (
          <WorkspacePreparation
            key="preparing"
            visitorName={visitorName}
            onComplete={handlePreparationComplete}
            durationMs={2200}
          />
        )}

        {/* System State: Sleeping */}
        {stage === 'sleeping' && (
          <SleepScreen key="sleeping" onWake={handleWake} />
        )}

        {/* System State: Restarting Transition */}
        {stage === 'restarting' && (
          <motion.div
            key="restarting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070d] text-slate-100 select-none space-y-4"
          >
            <svg
              className="animate-spin text-cyan-400"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path className="opacity-90" d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5 2.9 16.8 4.4 18.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">
              Restarting workspace...
            </span>
          </motion.div>
        )}

        {/* System State: Shutting Down Transition */}
        {stage === 'shuttingdown' && (
          <motion.div
            key="shuttingdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030408] text-slate-100 select-none space-y-4"
          >
            <svg
              className="animate-spin text-rose-400"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path className="opacity-90" d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5 2.9 16.8 4.4 18.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">
              Shutting down...
            </span>
          </motion.div>
        )}

        {/* System State: Powered Off */}
        {stage === 'poweredoff' && (
          <ShutdownScreen key="poweredoff" onPowerOn={handlePowerOn} />
        )}
      </AnimatePresence>
    </div>
  )
}
