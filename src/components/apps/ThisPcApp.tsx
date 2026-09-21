import React from 'react'
import { Folder, FileText, HardDrive } from 'lucide-react'
import type { WindowState, VFSNode } from '@/types'
import { vfsAllNodes } from '@/data/vfs'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'
import { useWindowStore } from '@/store/useWindowStore'

interface ThisPcAppProps {
  windowState: WindowState
}

export const ThisPcApp: React.FC<ThisPcAppProps> = () => {
  const openWindow = useWindowStore((state) => state.openWindow)

  // Top-level workspace folders & files
  const desktopFolders = vfsAllNodes.filter(
    (n) => n.type === 'folder' && n.parentId === null
  )

  const desktopFiles = vfsAllNodes.filter(
    (n) => n.type !== 'folder' && n.parentId === null && n.id !== 'node-this-pc' && n.id !== 'trash-recycle-bin'
  )

  const handleOpenNode = (node: VFSNode) => {
    openWindow({
      id: `win-${node.id}`,
      appId: node.appHandler,
      title: node.name,
      iconType: node.iconType,
      metadata: node.metadata,
    })
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-transparent text-slate-100 overflow-y-auto select-none p-6 sm:p-8 space-y-6">
      {/* Overview Banner */}
      <div className="flex items-center space-x-4 p-5 rounded-[var(--radius-window)] bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-white/10 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <HardDrive size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight font-sans">
            This PC — Portfolio Workspace
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Adarsh Pathak's personal developer workspace &amp; project directory overview.
          </p>
        </div>
      </div>

      {/* Portfolio Folders Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 px-1">
          <Folder size={14} />
          <span>Portfolio Folders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {desktopFolders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleOpenNode(folder)}
              className="group p-4 rounded-[var(--radius-control)] bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-white/15 transition cursor-pointer flex items-center space-x-3 shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 pointer-events-none group-hover:scale-105 transition-transform">
                {resolveVfsIcon(folder.iconType, 36)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                  {folder.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {folder.metadata?.description || 'Folder'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Files Section */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 px-1">
          <FileText size={14} />
          <span>Primary Workspace Files</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {desktopFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleOpenNode(file)}
              className="group p-4 rounded-[var(--radius-control)] bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-white/15 transition cursor-pointer flex items-center space-x-3 shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 pointer-events-none group-hover:scale-105 transition-transform">
                {resolveVfsIcon(file.iconType, 36)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {file.metadata?.title || file.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
