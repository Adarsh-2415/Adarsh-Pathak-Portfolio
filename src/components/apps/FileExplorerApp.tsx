import React, { useState } from 'react'
import {
  ArrowLeft,
  ArrowUp,
  RotateCw,
  Search,
  Folder,
  ChevronRight,
  HardDrive,
  Grid,
  List as ListIcon,
  Play,
} from 'lucide-react'
import type { WindowState, VFSNode } from '@/types'
import { getChildNodes, getNodeById, getBreadcrumbs, vfsAllNodes } from '@/data/vfs'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'
import { useWindowStore } from '@/store/useWindowStore'

interface FileExplorerAppProps {
  windowState: WindowState
}

export const FileExplorerApp: React.FC<FileExplorerAppProps> = ({ windowState }) => {
  // Determine initial folder ID from window State / metadata
  const initialFolderId = windowState.metadata?.title === 'This PC'
    ? null
    : windowState.id.replace('win-', '')

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    getNodeById(initialFolderId || '') ? initialFolderId : null
  )
  const [history, setHistory] = useState<(string | null)[]>([currentFolderId])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const openWindow = useWindowStore((state) => state.openWindow)

  const currentFolder = currentFolderId ? getNodeById(currentFolderId) : null
  const childNodes = getChildNodes(currentFolderId)
  const breadcrumbs = getBreadcrumbs(currentFolderId)

  const filteredNodes = childNodes.filter((node) => {
    if (!searchQuery.trim()) return true
    return node.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  })

  const navigateToFolder = (folderId: string | null) => {
    if (folderId === currentFolderId) return
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(folderId)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentFolderId(folderId)
    setSelectedNodeId(null)
    setSearchQuery('')
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1
      setHistoryIndex(nextIdx)
      setCurrentFolderId(history[nextIdx])
      setSelectedNodeId(null)
    }
  }

  const handleUp = () => {
    if (currentFolder && currentFolder.parentId !== undefined) {
      navigateToFolder(currentFolder.parentId)
    } else if (currentFolderId !== null) {
      navigateToFolder(null)
    }
  }

  const handleItemDoubleClick = (node: VFSNode) => {
    if (node.type === 'folder') {
      navigateToFolder(node.id)
    } else {
      openWindow({
        id: `win-${node.id}`,
        appId: node.appHandler,
        title: node.name,
        iconType: node.iconType,
        metadata: node.metadata,
      })
    }
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-transparent text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Windows 11 Explorer Navigation Toolbar */}
      <div className="p-2 px-3 bg-white/[0.04] border-b border-white/8 flex flex-wrap items-center gap-2 shrink-0 backdrop-blur-xs">
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            title="Back"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={handleUp}
            disabled={currentFolderId === null}
            title="Up to parent folder"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <ArrowUp size={15} />
          </button>
          <button
            onClick={() => setCurrentFolderId(currentFolderId)}
            title="Refresh location"
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Breadcrumb Address Bar */}
        <div className="flex-1 min-w-[200px] h-8 px-3 rounded-[var(--radius-control)] bg-black/35 border border-white/12 flex items-center text-xs text-slate-300 overflow-x-auto shadow-inner">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              {idx > 0 && <ChevronRight size={12} className="text-slate-500 mx-1 shrink-0" />}
              <button
                onClick={() => navigateToFolder(crumb.id === 'root' ? null : crumb.id)}
                className="hover:text-white font-medium shrink-0 cursor-pointer transition-colors"
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-48 h-8 px-2.5 rounded-[var(--radius-control)] bg-black/35 border border-white/12 flex items-center space-x-2 focus-within:border-cyan-400/50 focus-within:bg-black/55 shadow-inner transition-all">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentFolder?.name || 'This PC'}...`}
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 border-l border-white/10 pl-2">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid view"
            className={`w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center cursor-pointer transition-colors ${
              viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/8'
            }`}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List view"
            className={`w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center cursor-pointer transition-colors ${
              viewMode === 'list' ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/8'
            }`}
          >
            <ListIcon size={15} />
          </button>
        </div>
      </div>

      {/* Body: Left Sidebar + Right Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Tree */}
        <aside className="w-48 bg-slate-950/45 border-r border-white/8 p-3 space-y-3 hidden sm:block shrink-0 overflow-y-auto backdrop-blur-md">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider px-2">
            Quick Access
          </span>
          <div className="space-y-0.5 text-xs">
            <button
              onClick={() => navigateToFolder(null)}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] transition-all cursor-pointer ${
                currentFolderId === null ? 'bg-white/12 text-white font-medium border border-white/12 shadow-sm' : 'text-slate-300 hover:bg-white/8'
              }`}
            >
              <HardDrive size={15} className="text-cyan-400" />
              <span>This PC</span>
            </button>

            {vfsAllNodes
              .filter((n) => n.type === 'folder' && n.parentId === null)
              .map((folderNode) => (
                <button
                  key={folderNode.id}
                  onClick={() => navigateToFolder(folderNode.id)}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] transition-all cursor-pointer ${
                    currentFolderId === folderNode.id ? 'bg-white/12 text-white font-medium border border-white/12 shadow-sm' : 'text-slate-300 hover:bg-white/8'
                  }`}
                >
                  <Folder size={15} className="text-amber-400" />
                  <span className="truncate">{folderNode.name}</span>
                </button>
              ))}
          </div>
        </aside>

        {/* Right Main Folder Contents Container */}
        <main
          onClick={() => setSelectedNodeId(null)}
          className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-900/5 backdrop-blur-xs"
        >
          {filteredNodes.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNodeId(node.id)
                    }}
                    onDoubleClick={() => handleItemDoubleClick(node)}
                    className={`group flex flex-col items-center p-2.5 rounded-[var(--radius-control)] cursor-pointer text-center transition-all border ${
                      selectedNodeId === node.id
                        ? 'bg-[var(--surface-selected)] border-[var(--surface-selected-border)] shadow-md text-white backdrop-blur-sm'
                        : 'border-transparent hover:bg-white/8 hover:border-white/10'
                    }`}
                  >
                    {node.type === 'video' || node.iconType === 'video' ? (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-cyan-500/25 shadow-sm group-hover:scale-[1.02] group-hover:border-cyan-400/50 transition-transform duration-150 flex flex-col items-center justify-center">
                        {node.metadata?.previewImage ? (
                          <img
                            src={node.metadata.previewImage}
                            alt={node.name}
                            className="w-full h-full object-cover opacity-80"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center pl-0.5 shadow-md group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all">
                            <Play size={18} className="fill-cyan-300/40" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-[9px] font-mono text-cyan-300 uppercase tracking-wide">
                          Video
                        </span>
                      </div>
                    ) : node.metadata?.mediaUrl ? (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-black/40 border border-white/15 shadow-sm group-hover:scale-[1.02] group-hover:border-white/30 transition-transform duration-150 flex items-center justify-center">
                        <img
                          src={node.metadata.mediaUrl}
                          alt={node.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center pointer-events-none drop-shadow-md group-hover:scale-105 transition-transform duration-150">
                        {resolveVfsIcon(node.iconType, 40)}
                      </div>
                    )}
                    <span className="mt-2 text-xs font-sans text-slate-200 group-hover:text-white line-clamp-2 break-words">
                      {node.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNodeId(node.id)
                    }}
                    onDoubleClick={() => handleItemDoubleClick(node)}
                    className={`flex items-center justify-between p-2.5 rounded-[var(--radius-control)] cursor-pointer transition-all border text-xs ${
                      selectedNodeId === node.id
                        ? 'bg-[var(--surface-selected)] border-[var(--surface-selected-border)] text-white shadow-sm backdrop-blur-sm'
                        : 'border-transparent hover:bg-white/8 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-7 h-7 rounded overflow-hidden flex items-center justify-center shrink-0 bg-black/40 border border-white/10">
                        {node.type === 'video' || node.iconType === 'video' ? (
                          <Play size={14} className="text-cyan-400 pl-0.5" />
                        ) : node.metadata?.mediaUrl ? (
                          <img
                            src={node.metadata.mediaUrl}
                            alt={node.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          resolveVfsIcon(node.iconType, 20)
                        )}
                      </div>
                      <span className="font-medium truncate">{node.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] shrink-0">
                      {node.type === 'video' ? 'Video File' : node.type === 'image' ? 'Image File' : node.dateModified || 'Folder'}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16 space-y-2">
              <Folder size={40} className="text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-medium">This folder is empty</p>
              <p className="text-xs text-slate-500">Actual portfolio work items will be loaded here.</p>
            </div>
          )}
        </main>
      </div>

      {/* Explorer Footer Status Bar */}
      <div className="h-6 px-4 bg-black/30 border-t border-white/8 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0 backdrop-blur-xs">
        <span>{filteredNodes.length} items</span>
        <span>{selectedNodeId ? '1 item selected' : 'Ready'}</span>
      </div>
    </div>
  )
}

