export interface VisitorSession {
  visitorName: string
  enteredAt: number | null
  isWorkspaceReady: boolean
  isSoundEnabled: boolean
  isHighPerformance: boolean
}

export type ThemeMode = 'dark' | 'mica'
