import React from 'react'
import { useWindowStore } from '@/store/useWindowStore'
import { WindowFrame } from './WindowFrame'

/**
 * WindowManager
 * Manages rendering of all active windows from useWindowStore.
 */
export const WindowManager: React.FC = () => {
  const windows = useWindowStore((state) => state.windows)
  const openWindows = windows.filter((w) => w.isOpen)

  return (
    <div className="pointer-events-auto" aria-label="Open application windows">
      {openWindows.map((win) => (
        <WindowFrame key={win.id} windowState={win} />
      ))}
    </div>
  )
}
