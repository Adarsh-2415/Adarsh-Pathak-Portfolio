import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DesktopCanvas } from './DesktopCanvas'
import { WindowManager } from '@/components/window/WindowManager'
import { Taskbar } from '@/components/taskbar/Taskbar'
import { StartMenu } from '@/components/taskbar/StartMenu'
import { TaskbarSearch } from '@/components/taskbar/TaskbarSearch'
import { DesktopWallpaperBackground } from '@/components/background/DesktopWallpaperBackground'
import { SleepScreen } from '@/components/lockscreen/SleepScreen'
import { ShutdownScreen } from '@/components/lockscreen/ShutdownScreen'
import { useSessionStore } from '@/store/useSessionStore'

type DesktopPowerState = 'active' | 'sleeping' | 'restarting' | 'shuttingdown' | 'poweredoff'

interface DesktopEnvironmentProps {
  onResetSession?: () => void
}

/**
 * DesktopEnvironment
 * Master interactive Windows 11-inspired desktop environment for Adarsh Pathak.
 * Connects Desktop Wallpaper Background, Desktop Canvas (VFS icons, marquee selection, context menu),
 * Window Manager, centered Taskbar, Start Menu, Search, and unified Power Architecture.
 */
export const DesktopEnvironment: React.FC<DesktopEnvironmentProps> = ({ onResetSession }) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [powerState, setPowerState] = useState<DesktopPowerState>('active')

  const { setVisitorName, setWorkspaceReady } = useSessionStore()

  // Power actions aligning with approved architecture
  const handleSleep = () => {
    setIsStartMenuOpen(false)
    setIsSearchOpen(false)
    setPowerState('sleeping')
  }

  const handleWake = () => {
    setPowerState('active')
  }

  const handleRestart = () => {
    setIsStartMenuOpen(false)
    setIsSearchOpen(false)
    setPowerState('restarting')
    setTimeout(() => {
      setVisitorName('')
      if (onResetSession) {
        onResetSession()
      } else {
        setWorkspaceReady(false)
      }
    }, 1200)
  }

  const handleShutdown = () => {
    setIsStartMenuOpen(false)
    setIsSearchOpen(false)
    setPowerState('shuttingdown')
    setTimeout(() => {
      setPowerState('poweredoff')
    }, 1300)
  }

  const handlePowerOn = () => {
    setPowerState('active')
    if (onResetSession) {
      onResetSession()
    } else {
      setWorkspaceReady(false)
    }
  }

  const isDimmed = powerState === 'sleeping' || powerState === 'shuttingdown' || powerState === 'poweredoff'

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#05070e] text-slate-100 font-sans">
      {/* Desktop Background Layer */}
      <DesktopWallpaperBackground isDimmed={isDimmed} />

      {/* Desktop Canvas (VFS Icons, Selection Marquee, Context Menu) */}
      <DesktopCanvas />

      {/* Window Manager Layer */}
      <WindowManager />

      {/* Centered Taskbar */}
      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        isSearchOpen={isSearchOpen}
        onToggleStartMenu={() => {
          setIsSearchOpen(false)
          setIsStartMenuOpen((prev) => !prev)
        }}
        onToggleSearch={() => {
          setIsStartMenuOpen(false)
          setIsSearchOpen((prev) => !prev)
        }}
      />

      {/* Start Menu Flyout */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <StartMenu
            isOpen={isStartMenuOpen}
            onClose={() => setIsStartMenuOpen(false)}
            onOpenSearch={() => {
              setIsStartMenuOpen(false)
              setIsSearchOpen(true)
            }}
            onSleep={handleSleep}
            onRestart={handleRestart}
            onShutdown={handleShutdown}
          />
        )}
      </AnimatePresence>

      {/* Taskbar Search Flyout */}
      <AnimatePresence>
        {isSearchOpen && (
          <TaskbarSearch
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* System Power States Overlay */}
      <AnimatePresence>
        {powerState === 'sleeping' && (
          <SleepScreen key="sleeping" onWake={handleWake} />
        )}

        {powerState === 'restarting' && (
          <motion.div
            key="restarting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#05070d] text-slate-100 select-none space-y-4"
          >
            <svg
              className="animate-spin text-cyan-400"
              width="26"
              height="26"
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

        {powerState === 'shuttingdown' && (
          <motion.div
            key="shuttingdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#030408] text-slate-100 select-none space-y-4"
          >
            <svg
              className="animate-spin text-rose-400"
              width="26"
              height="26"
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

        {powerState === 'poweredoff' && (
          <ShutdownScreen key="poweredoff" onPowerOn={handlePowerOn} />
        )}
      </AnimatePresence>
    </div>
  )
}
