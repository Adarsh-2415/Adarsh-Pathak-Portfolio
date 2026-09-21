import { create } from 'zustand'
import type { AppId, VFSMetadata, WindowPosition, WindowSize, WindowSnapTarget, WindowState } from '@/types'

interface OpenWindowPayload {
  id?: string
  appId: AppId
  title: string
  iconType?: string
  defaultPosition?: WindowPosition
  defaultSize?: WindowSize
  metadata?: VFSMetadata
}

interface WindowStoreState {
  windows: WindowState[]
  activeWindowId: string | null
  maxZIndex: number

  openWindow: (payload: OpenWindowPayload) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  toggleMinimize: (id: string) => void
  updateWindowPosition: (id: string, position: WindowPosition) => void
  updateWindowSize: (id: string, size: WindowSize) => void
  snapWindow: (id: string, target: WindowSnapTarget) => void
}

const DEFAULT_WIDTH = 840
const DEFAULT_HEIGHT = 560
const BASE_Z_INDEX = 100

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  maxZIndex: BASE_Z_INDEX,

  openWindow: (payload) => {
    const { windows, maxZIndex } = get()
    const id = payload.id || `win-${payload.appId}-${Date.now()}`
    
    // If window is already open, just bring to focus & un-minimize
    const existing = windows.find((w) => w.id === id || (w.appId === payload.appId && !payload.id))
    if (existing) {
      set({
        windows: windows.map((w) =>
          w.id === existing.id
            ? { ...w, isOpen: true, isMinimized: false, isFocused: true, zIndex: maxZIndex + 1 }
            : { ...w, isFocused: false }
        ),
        activeWindowId: existing.id,
        maxZIndex: maxZIndex + 1,
      })
      return
    }

    // Calculate cascading position
    const offset = (windows.length % 6) * 28
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800

    const initialWidth = Math.min(payload.defaultSize?.width || DEFAULT_WIDTH, screenW - 40)
    const initialHeight = Math.min(payload.defaultSize?.height || DEFAULT_HEIGHT, screenH - 120)

    const initialX = Math.max(20, Math.min(payload.defaultPosition?.x ?? (screenW - initialWidth) / 2 + offset, screenW - initialWidth - 20))
    const initialY = Math.max(20, Math.min(payload.defaultPosition?.y ?? (screenH - initialHeight) / 2 - 20 + offset, screenH - initialHeight - 60))

    const newWindow: WindowState = {
      id,
      appId: payload.appId,
      title: payload.title,
      iconType: payload.iconType || payload.appId,
      position: { x: initialX, y: initialY },
      size: { width: initialWidth, height: initialHeight },
      zIndex: maxZIndex + 1,
      isOpen: true,
      isFocused: true,
      isMinimized: false,
      isMaximized: false,
      metadata: payload.metadata,
    }

    set({
      windows: [...windows.map((w) => ({ ...w, isFocused: false })), newWindow],
      activeWindowId: id,
      maxZIndex: maxZIndex + 1,
    })
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id)
      const nextActive = remaining.length > 0 ? remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev)).id : null
      return {
        windows: remaining.map((w) => (w.id === nextActive ? { ...w, isFocused: true } : w)),
        activeWindowId: nextActive,
      }
    })
  },

  minimizeWindow: (id) => {
    set((state) => {
      const updated = state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true, isFocused: false } : w))
      const visible = updated.filter((w) => !w.isMinimized)
      const nextActive = visible.length > 0 ? visible.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev)).id : null
      return {
        windows: updated.map((w) => (w.id === nextActive ? { ...w, isFocused: true } : w)),
        activeWindowId: nextActive,
      }
    })
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            position: w.prevPosition || w.position,
            size: w.prevSize || w.size,
          }
        }
        // Maximize
        return {
          ...w,
          isMaximized: true,
          prevPosition: { ...w.position },
          prevSize: { ...w.size },
          position: { x: 0, y: 0 },
          size: {
            width: typeof window !== 'undefined' ? window.innerWidth : 1200,
            height: typeof window !== 'undefined' ? window.innerHeight - 48 : 752,
          },
        }
      }),
    }))
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMinimized: false,
              isFocused: true,
              zIndex: state.maxZIndex + 1,
            }
          : { ...w, isFocused: false }
      ),
      activeWindowId: id,
      maxZIndex: state.maxZIndex + 1,
    }))
  },

  toggleMinimize: (id) => {
    const { windows, activeWindowId, minimizeWindow, restoreWindow, focusWindow } = get()
    const target = windows.find((w) => w.id === id)
    if (!target) return

    if (target.isMinimized) {
      restoreWindow(id)
    } else if (activeWindowId === id) {
      minimizeWindow(id)
    } else {
      focusWindow(id)
    }
  },

  focusWindow: (id) => {
    const { windows, maxZIndex, activeWindowId } = get()
    if (activeWindowId === id) return

    set({
      windows: windows.map((w) =>
        w.id === id
          ? { ...w, isFocused: true, isMinimized: false, zIndex: maxZIndex + 1 }
          : { ...w, isFocused: false }
      ),
      activeWindowId: id,
      maxZIndex: maxZIndex + 1,
    })
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position, isMaximized: false } : w)),
    }))
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size, isMaximized: false } : w)),
    }))
  },

  snapWindow: (id, target) => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200
    const screenH = typeof window !== 'undefined' ? window.innerHeight - 48 : 752

    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w
        if (target === 'left') {
          return {
            ...w,
            isMaximized: false,
            prevPosition: { ...w.position },
            prevSize: { ...w.size },
            position: { x: 0, y: 0 },
            size: { width: Math.floor(screenW / 2), height: screenH },
          }
        }
        if (target === 'right') {
          return {
            ...w,
            isMaximized: false,
            prevPosition: { ...w.position },
            prevSize: { ...w.size },
            position: { x: Math.floor(screenW / 2), y: 0 },
            size: { width: Math.floor(screenW / 2), height: screenH },
          }
        }
        return w
      }),
    }))
  },
}))
