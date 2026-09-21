import React from 'react'
import { StartingExperience } from '@/components/lockscreen/StartingExperience'
import { DesktopEnvironment } from '@/components/desktop/DesktopEnvironment'
import { useSessionStore } from '@/store/useSessionStore'

export const App: React.FC = () => {
  const { isWorkspaceReady, setWorkspaceReady } = useSessionStore()

  if (!isWorkspaceReady) {
    return <StartingExperience onHandoff={() => setWorkspaceReady(true)} />
  }

  return <DesktopEnvironment onResetSession={() => setWorkspaceReady(false)} />
}

export default App
