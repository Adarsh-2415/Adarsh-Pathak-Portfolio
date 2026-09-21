import React from 'react'
import { Search } from 'lucide-react'
import { WorkspaceLauncherIcon } from '@/components/common/WindowsIcons'
import { TaskbarAppButton } from './TaskbarAppButton'
import { SystemTray } from './SystemTray'
import { useWindowStore } from '@/store/useWindowStore'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'

interface TaskbarProps {
  isStartMenuOpen: boolean
  isSearchOpen: boolean
  onToggleStartMenu: () => void
  onToggleSearch: () => void
}

/**
 * Taskbar
 * Windows 11-inspired fixed translucent Mica taskbar with centered dock,
 * WorkspaceLauncherIcon, Search button, pinned applications (File Explorer & Resume),
 * active running window indicators, and system tray.
 */
export const Taskbar: React.FC<TaskbarProps> = ({
  isStartMenuOpen,
  isSearchOpen,
  onToggleStartMenu,
  onToggleSearch,
}) => {
  const { windows, toggleMinimize, openWindow } = useWindowStore()

  // Match active/open windows for pinned apps
  const explorerWindow = windows.find(
    (w) => w.isOpen && (w.appId === 'explorer' || w.id === 'win-node-this-pc' || w.id.startsWith('win-folder-'))
  )
  const resumeWindow = windows.find(
    (w) => w.isOpen && (w.id === 'win-file-resume' || w.appId === 'doc-viewer')
  )

  // Non-pinned open windows
  const otherOpenWindows = windows.filter(
    (w) => w.isOpen && w.id !== explorerWindow?.id && w.id !== resumeWindow?.id
  )

  const handleExplorerClick = () => {
    if (explorerWindow) {
      toggleMinimize(explorerWindow.id)
    } else {
      openWindow({
        id: 'win-node-this-pc',
        appId: 'explorer',
        title: 'This PC',
        iconType: 'this-pc',
        metadata: { title: 'This PC' },
      })
    }
  }

  const handleResumeClick = () => {
    if (resumeWindow) {
      toggleMinimize(resumeWindow.id)
    } else {
      openWindow({
        id: 'win-file-resume',
        appId: 'doc-viewer',
        title: 'Resume.pdf',
        iconType: 'pdf',
        metadata: {
          title: 'Adarsh Pathak — Resume',
          description: 'Official resume document.',
          downloadUrl: '/resume.pdf',
        },
      })
    }
  }

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 h-12 z-[900] surface-taskbar flex items-center justify-between px-2 sm:px-3 select-none backdrop-blur-xl border-t border-white/10"
      role="navigation"
      aria-label="Taskbar"
    >
      {/* Left empty balance spacer */}
      <div className="w-12 sm:w-28 shrink-0 flex items-center" />

      {/* Centered Application Dock */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 h-full">
        {/* Start Button */}
        <button
          onClick={onToggleStartMenu}
          title="Start"
          aria-label="Start menu"
          aria-expanded={isStartMenuOpen}
          className={`h-10 px-2.5 rounded-[var(--radius-control)] flex items-center justify-center transition-all duration-150 cursor-pointer ${
            isStartMenuOpen
              ? 'bg-white/15 text-white shadow-inner'
              : 'hover:bg-white/10 text-slate-200'
          }`}
        >
          <WorkspaceLauncherIcon size={20} />
        </button>

        {/* Search Button */}
        <button
          onClick={onToggleSearch}
          title="Search"
          aria-label="Search flyout"
          aria-expanded={isSearchOpen}
          className={`h-10 px-3 rounded-[var(--radius-control)] flex items-center space-x-2 transition-all duration-150 cursor-pointer ${
            isSearchOpen
              ? 'bg-white/15 text-white shadow-inner'
              : 'hover:bg-white/10 text-slate-300'
          }`}
        >
          <Search size={16} className="text-slate-300" />
          <span className="hidden md:inline text-xs font-sans text-slate-300">Search</span>
        </button>

        <div className="h-5 w-[1px] bg-white/10 mx-1 shrink-0" aria-hidden="true" />

        {/* Pinned App 1: File Explorer */}
        {explorerWindow ? (
          <TaskbarAppButton window={explorerWindow} onClick={handleExplorerClick} />
        ) : (
          <button
            onClick={handleExplorerClick}
            title="File Explorer"
            aria-label="File Explorer pinned application"
            className="group relative h-10 px-2.5 rounded-[var(--radius-control)] flex items-center justify-center hover:bg-white/8 text-slate-300 transition-all duration-150 cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow-sm group-hover:scale-105 transition-transform">
              {resolveVfsIcon('folder', 22)}
            </div>
          </button>
        )}

        {/* Pinned App 2: Resume */}
        {resumeWindow ? (
          <TaskbarAppButton window={resumeWindow} onClick={handleResumeClick} />
        ) : (
          <button
            onClick={handleResumeClick}
            title="Resume.pdf"
            aria-label="Resume.pdf pinned application"
            className="group relative h-10 px-2.5 rounded-[var(--radius-control)] flex items-center justify-center hover:bg-white/8 text-slate-300 transition-all duration-150 cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow-sm group-hover:scale-105 transition-transform">
              {resolveVfsIcon('pdf', 22)}
            </div>
          </button>
        )}

        {/* Separator for other open windows if any exist */}
        {otherOpenWindows.length > 0 && (
          <div className="h-5 w-[1px] bg-white/10 mx-1 shrink-0" aria-hidden="true" />
        )}

        {/* Other Open Windows Buttons */}
        {otherOpenWindows.map((win) => (
          <TaskbarAppButton
            key={win.id}
            window={win}
            onClick={() => toggleMinimize(win.id)}
          />
        ))}
      </div>

      {/* Right Side: System Tray */}
      <div className="shrink-0 flex items-center justify-end">
        <SystemTray />
      </div>
    </footer>
  )
}

