import React from 'react'
import type { VFSNode } from '@/types'
import {
  WindowsFolderIcon,
  WindowsCodeFileIcon,
  WindowsDesignFileIcon,
  WindowsVideoFileIcon,
  WindowsDocFileIcon,
  WindowsRecycleBinIcon,
  WindowsSysInfoIcon,
  WindowsContactIcon,
} from '@/components/common/WindowsIcons'

interface DesktopIconProps {
  node: VFSNode
  isSelected: boolean
  onSelect: (id: string, e: React.MouseEvent) => void
  onOpen: (node: VFSNode) => void
}

export const resolveVfsIcon = (iconType: VFSNode['iconType'], size = 44) => {
  switch (iconType) {
    case 'folder':
      return <WindowsFolderIcon size={size} />
    case 'image':
      return <WindowsDesignFileIcon size={size} />
    case 'video':
      return <WindowsVideoFileIcon size={size} />
    case 'pdf':
      return <WindowsDocFileIcon size={size} />
    case 'sysinfo':
      return <WindowsSysInfoIcon size={size} />
    case 'contact':
      return <WindowsContactIcon size={size} />
    case 'trash':
      return <WindowsRecycleBinIcon size={size} />
    case 'app':
    case 'website':
    default:
      return <WindowsCodeFileIcon size={size} />
  }
}

/**
 * DesktopIcon
 * Reusable Windows 11-inspired desktop icon derived directly from VFSNode.
 * Supports single-click selection, double-click launch, focus ring,
 * and keyboard accessibility.
 */
export const DesktopIcon: React.FC<DesktopIconProps> = ({
  node,
  isSelected,
  onSelect,
  onOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(node.id, e)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOpen(node)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(node)
    }
  }

  return (
    <div
      data-vfs-id={node.id}
      tabIndex={0}
      role="button"
      aria-label={`${node.name}, ${node.type}`}
      aria-selected={isSelected}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col items-center justify-start w-[88px] min-h-[96px] p-1.5 rounded-[var(--radius-control)] select-none cursor-pointer transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        isSelected
          ? 'bg-[var(--surface-selected)] border border-[var(--surface-selected-border)] shadow-sm'
          : 'border border-transparent hover:bg-white/8 hover:border-white/10'
      }`}
    >
      {/* Icon Graphic */}
      <div className="w-12 h-12 flex items-center justify-center pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
        {resolveVfsIcon(node.iconType, 44)}
      </div>

      {/* Label (up to 2 lines, centered, text drop-shadow for wallpaper contrast) */}
      <span
        className={`mt-1 text-[11px] leading-[14px] text-center line-clamp-2 break-words font-sans tracking-tight px-1 py-0.5 rounded transition-colors ${
          isSelected
            ? 'text-white font-medium bg-cyan-950/70 border border-cyan-500/30'
            : 'text-slate-100 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]'
        }`}
      >
        {node.name}
      </span>
    </div>
  )
}
