import React, { useState, useRef, useEffect, useCallback } from 'react'
import { vfsRootNodes } from '@/data/vfs'
import type { VFSNode } from '@/types'
import { DesktopIcon } from './DesktopIcon'
import { DesktopSelectionBox, type SelectionRect } from './DesktopSelectionBox'
import { DesktopContextMenu, type ContextMenuPosition } from './DesktopContextMenu'
import { useWindowStore } from '@/store/useWindowStore'

export const DesktopCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<VFSNode[]>([...vfsRootNodes])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null)
  const [isDraggingMarquee, setIsDraggingMarquee] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null)
  const [isLargeIcons, setIsLargeIcons] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const canvasRef = useRef<HTMLDivElement>(null)
  const openWindow = useWindowStore((state) => state.openWindow)

  // Single Click Selection
  const handleSelectIcon = (id: string, e: React.MouseEvent) => {
    setContextMenuPos(null)
    if (e.ctrlKey || e.metaKey) {
      // Multi-select toggle
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else {
      // Exclusive select
      setSelectedIds(new Set([id]))
    }
  }

  // Double Click Open Window
  const handleOpenNode = useCallback(
    (node: VFSNode) => {
      setContextMenuPos(null)
      openWindow({
        id: `win-${node.id}`,
        appId: node.appHandler,
        title: node.name,
        iconType: node.iconType,
        metadata: node.metadata,
      })
    },
    [openWindow]
  )

  // Click Canvas Background (Deselect & Dismiss Menu)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only handle primary button for selection
    if (e.button !== 0) return

    setContextMenuPos(null)
    setSelectedIds(new Set())

    const startX = e.clientX
    const startY = e.clientY

    setSelectionRect({ startX, startY, currentX: startX, currentY: startY })
    setIsDraggingMarquee(true)
  }

  // Marquee Drag Movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMarquee || !canvasRef.current) return

      const currentX = e.clientX
      const currentY = e.clientY

      setSelectionRect((prev) => (prev ? { ...prev, currentX, currentY } : null))

      // Check intersection with desktop icon elements
      const rectX = Math.min(selectionRect?.startX || currentX, currentX)
      const rectY = Math.min(selectionRect?.startY || currentY, currentY)
      const rectW = Math.abs(currentX - (selectionRect?.startX || currentX))
      const rectH = Math.abs(currentY - (selectionRect?.startY || currentY))

      if (rectW > 5 || rectH > 5) {
        const iconElements = canvasRef.current.querySelectorAll('[data-vfs-id]')
        const newlySelected = new Set<string>()

        iconElements.forEach((el) => {
          const bounds = el.getBoundingClientRect()
          const intersects =
            bounds.left < rectX + rectW &&
            bounds.right > rectX &&
            bounds.top < rectY + rectH &&
            bounds.bottom > rectY

          if (intersects) {
            const vfsId = el.getAttribute('data-vfs-id')
            if (vfsId) newlySelected.add(vfsId)
          }
        })

        setSelectedIds(newlySelected)
      }
    }

    const handleMouseUp = () => {
      if (isDraggingMarquee) {
        setIsDraggingMarquee(false)
        setSelectionRect(null)
      }
    }

    if (isDraggingMarquee) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingMarquee, selectionRect?.startX, selectionRect?.startY])

  // Right Click Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
  }

  // Context Menu Real Actions
  const handleRefresh = () => {
    setSelectedIds(new Set())
    setRefreshKey((k) => k + 1)
  }

  const handleSortByName = () => {
    setNodes((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)))
  }

  const handleSortByType = () => {
    setNodes((prev) => [...prev].sort((a, b) => a.type.localeCompare(b.type)))
  }

  const handleToggleIconSize = () => {
    setIsLargeIcons((prev) => !prev)
  }

  const handleSelectAll = () => {
    setSelectedIds(new Set(nodes.map((n) => n.id)))
  }

  return (
    <main
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onContextMenu={handleContextMenu}
      className="absolute inset-0 bottom-12 overflow-hidden select-none z-10 p-4 sm:p-6 cursor-default"
      aria-label="Desktop workspace canvas"
    >
      {/* Selection Rectangle Marquee */}
      <DesktopSelectionBox rect={selectionRect} />

      {/* Desktop Icons Grid (Authentic VFS Data, Windows 11 Flow) */}
      <div
        key={refreshKey}
        className={`flex flex-col flex-wrap items-start content-start max-h-[calc(100vh-80px)] gap-y-2 gap-x-3 transition-opacity duration-200 ${
          isLargeIcons ? 'scale-110 origin-top-left gap-y-4 gap-x-5' : ''
        }`}
      >
        {nodes.map((node) => (
          <DesktopIcon
            key={node.id}
            node={node}
            isSelected={selectedIds.has(node.id)}
            onSelect={handleSelectIcon}
            onOpen={handleOpenNode}
          />
        ))}
      </div>

      {/* Context Menu */}
      <DesktopContextMenu
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        onRefresh={handleRefresh}
        onSortByName={handleSortByName}
        onSortByType={handleSortByType}
        onToggleIconSize={handleToggleIconSize}
        onSelectAll={handleSelectAll}
        isLargeIcons={isLargeIcons}
      />
    </main>
  )
}
