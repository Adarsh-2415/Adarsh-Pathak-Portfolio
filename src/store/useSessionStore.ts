import { create } from 'zustand'

interface SessionStoreState {
  visitorName: string
  enteredAt: number | null
  isWorkspaceReady: boolean
  isSoundEnabled: boolean
  isHighPerformance: boolean
  activeStartMenu: boolean
  activeSearch: boolean

  setVisitorName: (name: string) => void
  setWorkspaceReady: (ready: boolean) => void
  toggleSound: () => void
  togglePerformanceMode: () => void
  toggleStartMenu: () => void
  closeStartMenu: () => void
  toggleSearch: () => void
  closeSearch: () => void
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  visitorName: '',
  enteredAt: null,
  isWorkspaceReady: false,
  isSoundEnabled: false,
  isHighPerformance: true,
  activeStartMenu: false,
  activeSearch: false,

  setVisitorName: (name) => set({ visitorName: name.trim() || 'Visitor', enteredAt: Date.now() }),
  setWorkspaceReady: (ready) => set({ isWorkspaceReady: ready }),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  togglePerformanceMode: () => set((state) => ({ isHighPerformance: !state.isHighPerformance })),
  toggleStartMenu: () => set((state) => ({ activeStartMenu: !state.activeStartMenu, activeSearch: false })),
  closeStartMenu: () => set({ activeStartMenu: false }),
  toggleSearch: () => set((state) => ({ activeSearch: !state.activeSearch, activeStartMenu: false })),
  closeSearch: () => set({ activeSearch: false }),
}))
