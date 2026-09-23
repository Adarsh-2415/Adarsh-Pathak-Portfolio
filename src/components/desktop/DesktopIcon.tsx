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
  isLargeIcons?: boolean
  position?: { x: number; y: number }
  isDragging?: boolean
  onMouseDown?: (id: string, e: React.MouseEvent) => void
  onTouchStart?: (id: string, e: React.TouchEvent) => void
  isJustDragged?: () => boolean
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
 * Supports single-click selection, double-click launch, positioning, multi-drag,
 * focus ring, and keyboard accessibility.
 */
export const DesktopIcon: React.FC<DesktopIconProps> = ({
  node,
  isSelected,
  onSelect,
  onOpen,
  isLargeIcons = false,
  position,
  isDragging = false,
  onMouseDown,
  onTouchStart,
  isJustDragged,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isJustDragged && isJustDragged()) {
      return
    }
    onSelect(node.id, e)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isJustDragged && isJustDragged()) {
      return
    }
    onOpen(node)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(node)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(node.id, e)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (onTouchStart) {
      onTouchStart(node.id, e)
    }
  }

  const iconSize = isLargeIcons ? 56 : 44

  const style: React.CSSProperties = position
    ? {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        zIndex: isDragging ? 30 : isSelected ? 20 : 10,
      }
    : {}

  return (
    <div
      data-vfs-id={node.id}
      tabIndex={0}
      role="button"
      aria-label={`${node.name}, ${node.type}`}
      aria-selected={isSelected}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`group relative flex flex-col items-center justify-start p-1.5 rounded-[var(--radius-control)] select-none cursor-pointer transition-shadow duration-100 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        isLargeIcons ? 'w-[104px] min-h-[112px]' : 'w-[88px] min-h-[96px]'
      } ${
        isDragging
          ? 'bg-[var(--surface-selected)] border border-cyan-400/50 shadow-xl opacity-90 scale-[1.02] cursor-grabbing'
          : isSelected
          ? 'bg-[var(--surface-selected)] border border-[var(--surface-selected-border)] shadow-sm'
          : 'border border-transparent hover:bg-white/8 hover:border-white/10'
      }`}
    >
      {/* Icon Graphic */}
      <div
        className={`${
          isLargeIcons ? 'w-16 h-16' : 'w-12 h-12'
        } flex items-center justify-center pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform duration-150 ${
          isDragging ? '' : 'group-hover:scale-105 group-active:scale-95'
        }`}
      >
        {resolveVfsIcon(node.iconType, iconSize)}
      </div>

      {/* Label (up to 2 lines, centered, text drop-shadow for wallpaper contrast) */}
      <span
        className={`mt-1 text-[11px] leading-[14px] text-center line-clamp-2 break-words font-sans tracking-tight px-1 py-0.5 rounded transition-colors ${
          isSelected || isDragging
            ? 'text-white font-medium bg-cyan-950/70 border border-cyan-500/30'
            : 'text-slate-100 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]'
        }`}
      >
        {node.name}
      </span>
    </div>
  )
}

