import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronRight, Sparkles, Folder, FileText, Code2 } from 'lucide-react'
import { vfsAllNodes, vfsRootNodes } from '@/data/vfs'
import { profileData } from '@/data/content'
import type { VFSNode } from '@/types'
import { resolveVfsIcon } from '@/components/desktop/DesktopIcon'
import { useWindowStore } from '@/store/useWindowStore'

interface TaskbarSearchProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * TaskbarSearch
 * Windows 11-inspired search flyout querying authentic VFS nodes and core skills.
 * Note: Zero fake search results or hallucinated items.
 */
export const TaskbarSearch: React.FC<TaskbarSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)

  const openWindow = useWindowStore((state) => state.openWindow)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Outside click & Escape listener
  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const cleanQuery = query.trim().toLowerCase()

  // Authentic Results from VFS (all nodes including sub-nodes like websites)
  const matchingVfs = vfsAllNodes.filter((node) => {
    if (!cleanQuery) return false
    return (
      node.name.toLowerCase().includes(cleanQuery) ||
      node.type.toLowerCase().includes(cleanQuery) ||
      node.metadata?.title?.toLowerCase().includes(cleanQuery) ||
      node.metadata?.description?.toLowerCase().includes(cleanQuery)
    )
  })

  // Authentic Skills from profileData
  const allSkills = [
    ...profileData.coreSkills.languages,
    ...profileData.coreSkills.frameworks,
    ...profileData.coreSkills.tools,
    ...profileData.coreSkills.design,
  ]

  const matchingSkills = cleanQuery
    ? allSkills.filter((s) => s.toLowerCase().includes(cleanQuery))
    : []

  const handleLaunchNode = (node: VFSNode) => {
    openWindow({
      id: `win-${node.id}`,
      appId: node.appHandler,
      title: node.name,
      iconType: node.iconType,
      metadata: node.metadata,
    })
    onClose()
  }

  const handleLaunchAbout = () => {
    const aboutNode = vfsRootNodes.find((n) => n.id === 'file-about')
    if (aboutNode) {
      handleLaunchNode(aboutNode)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      ref={flyoutRef}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[950] w-[95vw] max-w-[560px] max-h-[580px] surface-menu rounded-[var(--radius-window)] flex flex-col overflow-hidden text-slate-100 shadow-2xl select-none"
      role="search"
      aria-label="Workspace search flyout"
    >
      {/* Search Input Bar */}
      <div className="p-4 pb-3 border-b border-white/10 flex items-center space-x-3 bg-black/30">
        <Search size={18} className="text-cyan-400 shrink-0 ml-1" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search workspace projects, skills, documents..."
          className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none font-sans"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results or Default Quick Suggestions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
        {cleanQuery ? (
          <>
            {/* Matching VFS Items */}
            {matchingVfs.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase px-2">
                  Workspace Files &amp; Folders ({matchingVfs.length})
                </span>
                {matchingVfs.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleLaunchNode(node)}
                    className="w-full flex items-center justify-between p-2.5 rounded-[var(--radius-control)] hover:bg-white/8 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {resolveVfsIcon(node.iconType, 28)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                          {node.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {node.metadata?.title || `${node.type} • ${node.appHandler}`}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}

            {/* Matching Skills */}
            {matchingSkills.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-indigo-400 uppercase px-2">
                  Verified Skills &amp; Tech ({matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5 p-2">
                  {matchingSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={handleLaunchAbout}
                      title={`View skill details in About Me`}
                      className="px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 hover:bg-indigo-900/80 transition cursor-pointer flex items-center space-x-1.5"
                    >
                      <Sparkles size={11} className="text-cyan-400" />
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Found */}
            {matchingVfs.length === 0 && matchingSkills.length === 0 && (
              <div className="py-12 text-center text-slate-400 space-y-1">
                <p className="text-sm font-medium">No workspace items found for "{query}"</p>
                <p className="text-xs text-slate-500">
                  Search uses authentic portfolio VFS files and verified skill sets.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Default Quick Suggestions */
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase px-1">
              Quick Workspace Destinations
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const node = vfsRootNodes.find((n) => n.id === 'folder-design')
                  if (node) handleLaunchNode(node)
                }}
                className="flex items-center space-x-3 p-3 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/5 transition text-left cursor-pointer"
              >
                <Folder size={18} className="text-amber-400" />
                <div>
                  <p className="text-xs font-medium text-white">Design</p>
                  <p className="text-[10px] text-slate-400">Social Media &amp; Flex</p>
                </div>
              </button>

              <button
                onClick={() => {
                  const node = vfsRootNodes.find((n) => n.id === 'folder-website')
                  if (node) handleLaunchNode(node)
                }}
                className="flex items-center space-x-3 p-3 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/5 transition text-left cursor-pointer"
              >
                <Folder size={18} className="text-cyan-400" />
                <div>
                  <p className="text-xs font-medium text-white">Website</p>
                  <p className="text-[10px] text-slate-400">Web applications</p>
                </div>
              </button>

              <button
                onClick={() => {
                  const node = vfsRootNodes.find((n) => n.id === 'file-resume')
                  if (node) handleLaunchNode(node)
                }}
                className="flex items-center space-x-3 p-3 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/5 transition text-left cursor-pointer"
              >
                <FileText size={18} className="text-rose-400" />
                <div>
                  <p className="text-xs font-medium text-white">Resume.pdf</p>
                  <p className="text-[10px] text-slate-400">Official document</p>
                </div>
              </button>

              <button
                onClick={() => {
                  const node = vfsRootNodes.find((n) => n.id === 'file-about')
                  if (node) handleLaunchNode(node)
                }}
                className="flex items-center space-x-3 p-3 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/5 transition text-left cursor-pointer"
              >
                <Code2 size={18} className="text-indigo-400" />
                <div>
                  <p className="text-xs font-medium text-white">About Me</p>
                  <p className="text-[10px] text-slate-400">Developer context</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
