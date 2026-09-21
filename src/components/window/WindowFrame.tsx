import React, { useState, useRef, useEffect } from 'react'
import type { WindowState } from '@/types'
import { useWindowStore } from '@/store/useWindowStore'
import {
  MinimizeGlyph,
  MaximizeGlyph,
  RestoreGlyph,
  CloseGlyph,
} from '@/components/common/WindowsIcons'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'
import { AppDispatcher } from '@/components/apps/AppDispatcher'

interface WindowFrameProps {
  windowState: WindowState
}

/**
 * WindowFrame
 * Reusable Windows 11-inspired draggable, resizable, and maximizable window frame.
 * Features: Mica surface, native control glyphs, close button red hover (#e81123),
 * active focus elevation, taskbar boundary safety, and mobile auto-viewport mode.
 */
export const WindowFrame: React.FC<WindowFrameProps> = ({ windowState }) => {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore()

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [resizeStart, setResizeStart] = useState<{
    mouseX: number
    mouseY: number
    initW: number
    initH: number
    initX: number
    initY: number
  } | null>(null)

  const frameRef = useRef<HTMLDivElement>(null)

  // Auto-detect mobile screen to ensure full-viewport behavior
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  // Focus on interaction
  const handleFrameMouseDown = () => {
    if (!windowState.isFocused) {
      focusWindow(windowState.id)
    }
  }

  // --- Title Bar Dragging ---
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized || isMobile) return
    // Only left button
    if (e.button !== 0) return

    focusWindow(windowState.id)
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y,
    })
  }

  // Double click title bar to toggle maximize
  const handleTitleBarDoubleClick = () => {
    if (isMobile) return
    maximizeWindow(windowState.id)
  }

  // --- Edge / Corner Resizing ---
  const handleResizeMouseDown = (direction: string, e: React.MouseEvent) => {
    if (windowState.isMaximized || isMobile) return
    e.stopPropagation()
    e.preventDefault()

    focusWindow(windowState.id)
    setIsResizing(direction)
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      initW: windowState.size.width,
      initH: windowState.size.height,
      initX: windowState.position.x,
      initY: windowState.position.y,
    })
  }

  // Drag and Resize Mouse Listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const screenW = window.innerWidth
      const screenH = window.innerHeight
      const taskbarH = 48

      // Handle Dragging
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, screenW - 100))
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, screenH - taskbarH - 40))
        updateWindowPosition(windowState.id, { x: newX, y: newY })
      }

      // Handle Resizing
      if (isResizing && resizeStart) {
        const deltaX = e.clientX - resizeStart.mouseX
        const deltaY = e.clientY - resizeStart.mouseY
        const MIN_W = 380
        const MIN_H = 260

        let newW = resizeStart.initW
        let newH = resizeStart.initH
        let newX = resizeStart.initX
        let newY = resizeStart.initY

        // East / West
        if (isResizing.includes('e')) {
          newW = Math.max(MIN_W, Math.min(resizeStart.initW + deltaX, screenW - newX))
        }
        if (isResizing.includes('w')) {
          const maxLeftDelta = resizeStart.initW - MIN_W
          const appliedDeltaX = Math.min(maxLeftDelta, Math.max(-resizeStart.initX, deltaX))
          newW = resizeStart.initW - appliedDeltaX
          newX = resizeStart.initX + appliedDeltaX
        }

        // South / North
        if (isResizing.includes('s')) {
          newH = Math.max(MIN_H, Math.min(resizeStart.initH + deltaY, screenH - taskbarH - newY))
        }
        if (isResizing.includes('n')) {
          const maxTopDelta = resizeStart.initH - MIN_H
          const appliedDeltaY = Math.min(maxTopDelta, Math.max(-resizeStart.initY, deltaY))
          newH = resizeStart.initH - appliedDeltaY
          newY = resizeStart.initY + appliedDeltaY
        }

        updateWindowSize(windowState.id, { width: newW, height: newH })
        if (newX !== resizeStart.initX || newY !== resizeStart.initY) {
          updateWindowPosition(windowState.id, { x: newX, y: newY })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
      setResizeStart(null)
    }

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, updateWindowPosition, updateWindowSize, windowState.id])

  if (windowState.isMinimized) {
    return null
  }

  // Positioning & Size styles
  const frameStyle: React.CSSProperties = isMobile || windowState.isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)',
        zIndex: windowState.zIndex,
        borderRadius: 0,
      }
    : {
        position: 'fixed',
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `${windowState.size.width}px`,
        height: `${windowState.size.height}px`,
        zIndex: windowState.zIndex,
        borderRadius: 'var(--radius-window)',
      }

  return (
    <div
      ref={frameRef}
      onMouseDown={handleFrameMouseDown}
      style={frameStyle}
      className={`flex flex-col surface-mica overflow-hidden select-none transition-shadow duration-150 ${
        windowState.isFocused ? 'surface-mica-focused' : 'surface-mica-inactive'
      }`}
      role="dialog"
      aria-label={windowState.title}
    >
      {/* Title Bar */}
      <header
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleTitleBarDoubleClick}
        className="h-10 px-3 bg-[var(--window-titlebar)] border-b border-white/8 backdrop-blur-md flex items-center justify-between cursor-default shrink-0"
      >
        {/* App Icon & Title */}
        <div className="flex items-center space-x-2.5 overflow-hidden pointer-events-none">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            {resolveVfsIcon(windowState.iconType as any, 18)}
          </div>
          <span
            className={`text-xs font-sans truncate ${
              windowState.isFocused ? 'text-slate-100 font-medium' : 'text-slate-400'
            }`}
          >
            {windowState.title}
          </span>
        </div>

        {/* Windows 11 Window Controls */}
        <div className="flex items-center h-full -mr-3">
          {/* Minimize */}
          <button
            onClick={() => minimizeWindow(windowState.id)}
            title="Minimize"
            aria-label="Minimize"
            className="h-full w-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <MinimizeGlyph />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={() => maximizeWindow(windowState.id)}
            title={windowState.isMaximized ? 'Restore' : 'Maximize'}
            aria-label={windowState.isMaximized ? 'Restore' : 'Maximize'}
            className="h-full w-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {windowState.isMaximized ? <RestoreGlyph /> : <MaximizeGlyph />}
          </button>

          {/* Close */}
          <button
            onClick={() => closeWindow(windowState.id)}
            title="Close"
            aria-label="Close"
            className="h-full w-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[var(--control-close-hover)] active:bg-[var(--control-close-active)] transition-colors cursor-pointer"
          >
            <CloseGlyph />
          </button>
        </div>
      </header>

      {/* Window Body (Content) */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <AppDispatcher windowState={windowState} />
      </div>

      {/* Resize Handles (Only when not maximized and not mobile) */}
      {!windowState.isMaximized && !isMobile && (
        <>
          {/* Edge Handles */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('n', e)}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-n-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('s', e)}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('w', e)}
            className="absolute left-0 top-2 bottom-2 w-1.5 cursor-w-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('e', e)}
            className="absolute right-0 top-2 bottom-2 w-1.5 cursor-e-resize"
          />

          {/* Corner Handles */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('nw', e)}
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('ne', e)}
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('sw', e)}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('se', e)}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          />
        </>
      )}
    </div>
  )
}
