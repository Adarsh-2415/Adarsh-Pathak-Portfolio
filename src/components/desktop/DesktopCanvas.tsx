import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { vfsRootNodes } from '@/data/vfs'
import type { VFSNode } from '@/types'
import { DesktopIcon } from './DesktopIcon'
import { DesktopSelectionBox, type SelectionRect } from './DesktopSelectionBox'
import { DesktopContextMenu, type ContextMenuPosition } from './DesktopContextMenu'
import { useWindowStore } from '@/store/useWindowStore'

const POSITIONS_STORAGE_KEY = 'portfolio_desktop_positions_v1'

/**
 * Computes default column-grid icon positions (Windows desktop style).
 */
export const computeDefaultPositions = (
  nodes: VFSNode[],
  isLargeIcons: boolean,
  canvasHeight: number
): Record<string, { x: number; y: number }> => {
  const iconWidth = isLargeIcons ? 104 : 88
  const iconHeight = isLargeIcons ? 112 : 96
  const paddingX = 20
  const paddingY = 20
  const gapX = 16
  const gapY = 16

  const stepX = iconWidth + gapX
  const stepY = iconHeight + gapY

  const maxRows = Math.max(1, Math.floor((canvasHeight - paddingY * 2) / stepY))

  const result: Record<string, { x: number; y: number }> = {}
  nodes.forEach((node, index) => {
    const col = Math.floor(index / maxRows)
    const row = index % maxRows
    const x = paddingX + col * stepX
    const y = paddingY + row * stepY
    result[node.id] = { x, y }
  })
  return result
}

/**
 * Measures actual rendered dimensions of icon elements in the DOM.
 * Accounts for font zoom, line wrapping, and dynamic label heights.
 */
export const getIconDimensions = (
  canvasEl: HTMLElement | null,
  isLargeIcons: boolean
): Record<string, { width: number; height: number }> => {
  const defaultW = isLargeIcons ? 104 : 88
  const defaultH = isLargeIcons ? 112 : 96
  const dims: Record<string, { width: number; height: number }> = {}

  if (canvasEl) {
    const iconEls = canvasEl.querySelectorAll('[data-vfs-id]')
    iconEls.forEach((el) => {
      const vfsId = el.getAttribute('data-vfs-id')
      if (vfsId) {
        const rect = el.getBoundingClientRect()
        dims[vfsId] = {
          width: Math.max(defaultW, Math.ceil(rect.width)),
          height: Math.max(defaultH, Math.ceil(rect.height)),
        }
      }
    })
  }

  return dims
}

/**
 * Revalidates desktop icon positions on viewport/zoom changes.
 * - Clamps icons within usable canvas bounds (above taskbar).
 * - Resolves overlaps using minimal positional displacement.
 * - Strictly preserves user layout order and custom dragged positions whenever valid.
 * - Does NOT alter VFS node data or force full grid resets.
 */
export const revalidateDesktopLayout = (
  nodes: VFSNode[],
  currentPositions: Record<string, { x: number; y: number }>,
  isLargeIcons: boolean,
  canvasWidth: number,
  canvasHeight: number,
  iconDimensions?: Record<string, { width: number; height: number }>
): Record<string, { x: number; y: number }> => {
  const defaultW = isLargeIcons ? 104 : 88
  const defaultH = isLargeIcons ? 112 : 96
  const minX = 8
  const minY = 8
  const gapX = 12
  const gapY = 12

  // 1. Initial Clamping to Canvas Bounds
  const nextPositions: Record<string, { x: number; y: number }> = {}
  nodes.forEach((node) => {
    const dim = iconDimensions?.[node.id] || { width: defaultW, height: defaultH }
    const pos = currentPositions[node.id] || { x: minX, y: minY }

    const maxX = Math.max(minX, canvasWidth - dim.width - minX)
    const maxY = Math.max(minY, canvasHeight - dim.height - minY)

    nextPositions[node.id] = {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    }
  })

  // 2. Sort nodes by visual layout priority (X column bins primary, Y secondary)
  const sortedNodes = [...nodes].sort((a, b) => {
    const posA = nextPositions[a.id]
    const posB = nextPositions[b.id]
    const colA = Math.floor(posA.x / 60)
    const colB = Math.floor(posB.x / 60)
    if (colA !== colB) return colA - colB
    return posA.y - posB.y
  })

  // 3. Sequential Collision Resolution with Minimal Positional Displacement
  const placed: Array<{ id: string; x: number; y: number; w: number; h: number }> = []

  sortedNodes.forEach((node) => {
    const dim = iconDimensions?.[node.id] || { width: defaultW, height: defaultH }
    let currX = nextPositions[node.id].x
    let currY = nextPositions[node.id].y

    const maxX = Math.max(minX, canvasWidth - dim.width - minX)
    const maxY = Math.max(minY, canvasHeight - dim.height - minY)

    let hasCollision = true
    let attempts = 0
    const maxAttempts = 60

    while (hasCollision && attempts < maxAttempts) {
      attempts++
      hasCollision = false

      for (const p of placed) {
        const overlapsX = currX < p.x + p.w + gapX && currX + dim.width + gapX > p.x
        const overlapsY = currY < p.y + p.h + gapY && currY + dim.height + gapY > p.y

        if (overlapsX && overlapsY) {
          hasCollision = true
          const nextY = p.y + p.h + gapY
          if (nextY <= maxY) {
            currY = nextY
          } else {
            currX = p.x + p.w + gapX
            currY = minY
          }
          currX = Math.max(minX, Math.min(maxX, currX))
          currY = Math.max(minY, Math.min(maxY, currY))
          break
        }
      }
    }

    nextPositions[node.id] = { x: currX, y: currY }
    placed.push({ id: node.id, x: currX, y: currY, w: dim.width, h: dim.height })
  })

  return nextPositions
}

/**
 * Clamps positions so icons remain inside usable desktop bounds.
 */
export const clampPositionsToBounds = (
  positions: Record<string, { x: number; y: number }>,
  isLargeIcons: boolean,
  canvasWidth: number,
  canvasHeight: number
): Record<string, { x: number; y: number }> => {
  return revalidateDesktopLayout(vfsRootNodes, positions, isLargeIcons, canvasWidth, canvasHeight)
}

interface DragState {
  isPointerDown: boolean
  isDragging: boolean
  hasMovedPastThreshold: boolean
  pointerStart: { x: number; y: number }
  dragNodes: string[]
  initialPositions: Record<string, { x: number; y: number }>
  targetNodeId: string | null
  wasAlreadySelected: boolean
  isCtrlOrShift: boolean
}

export const DesktopCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<VFSNode[]>([...vfsRootNodes])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null)
  const [isDraggingMarquee, setIsDraggingMarquee] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null)
  const [isLargeIcons, setIsLargeIcons] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [draggingNodeIds, setDraggingNodeIds] = useState<Set<string>>(new Set())

  const canvasRef = useRef<HTMLDivElement>(null)
  const openWindow = useWindowStore((state) => state.openWindow)

  // Position Store Initialization
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200
    const screenH = typeof window !== 'undefined' ? window.innerHeight - 48 : 800
    const defaults = computeDefaultPositions(vfsRootNodes, false, screenH)

    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(POSITIONS_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === 'object') {
            return revalidateDesktopLayout(vfsRootNodes, { ...defaults, ...parsed }, false, screenW, screenH)
          }
        }
      } catch (e) {
        // Storage fallback
      }
    }
    return defaults
  })

  const dragStateRef = useRef<DragState>({
    isPointerDown: false,
    isDragging: false,
    hasMovedPastThreshold: false,
    pointerStart: { x: 0, y: 0 },
    dragNodes: [],
    initialPositions: {},
    targetNodeId: null,
    wasAlreadySelected: false,
    isCtrlOrShift: false,
  })

  const dragEndTimestampRef = useRef<number>(0)
  const latestPositionsRef = useRef(positions)

  useEffect(() => {
    latestPositionsRef.current = positions
  }, [positions])

  // Single Click Selection Handler
  const handleSelectIcon = (id: string, e: React.MouseEvent) => {
    setContextMenuPos(null)
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else if (e.shiftKey && selectedIds.size > 0) {
      const nodeIndexMap = new Map(nodes.map((n, idx) => [n.id, idx]))
      const lastSelected = Array.from(selectedIds).pop()
      const startIdx = nodeIndexMap.get(lastSelected!) ?? 0
      const endIdx = nodeIndexMap.get(id) ?? 0
      const minIdx = Math.min(startIdx, endIdx)
      const maxIdx = Math.max(startIdx, endIdx)
      const next = new Set(selectedIds)
      nodes.slice(minIdx, maxIdx + 1).forEach((n) => next.add(n.id))
      setSelectedIds(next)
    } else {
      setSelectedIds(new Set([id]))
    }
  }

  // Double Click Launch Window
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

  // Drag Movement Handler (Global Pointer Move)
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      const state = dragStateRef.current
      if (!state.isPointerDown) return

      const dx = e.clientX - state.pointerStart.x
      const dy = e.clientY - state.pointerStart.y
      const dist = Math.hypot(dx, dy)

      const DRAG_THRESHOLD = 6

      if (!state.isDragging && dist >= DRAG_THRESHOLD) {
        state.isDragging = true
        state.hasMovedPastThreshold = true
        setDraggingNodeIds(new Set(state.dragNodes))
      }

      if (state.isDragging) {
        const screenW = window.innerWidth
        const screenH = window.innerHeight - 48
        const iconWidth = isLargeIcons ? 104 : 88
        const iconHeight = isLargeIcons ? 112 : 96

        const minX = 8
        const maxX = Math.max(minX, screenW - iconWidth - 8)
        const minY = 8
        const maxY = Math.max(minY, screenH - iconHeight - 8)

        setPositions((prev) => {
          const next = { ...prev }
          state.dragNodes.forEach((id) => {
            const init = state.initialPositions[id]
            if (!init) return
            const clampedX = Math.max(minX, Math.min(maxX, init.x + dx))
            const clampedY = Math.max(minY, Math.min(maxY, init.y + dy))
            next[id] = { x: clampedX, y: clampedY }
          })
          return next
        })
      }
    },
    [isLargeIcons]
  )

  // Drag Release Handler (Global Pointer Up)
  const handleGlobalMouseUp = useCallback(() => {
    const state = dragStateRef.current
    if (!state.isPointerDown) return

    if (state.hasMovedPastThreshold) {
      dragEndTimestampRef.current = Date.now()
      try {
        sessionStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(latestPositionsRef.current))
      } catch (err) {
        // Storage fallback
      }
    } else {
      if (state.wasAlreadySelected && state.targetNodeId && !state.isCtrlOrShift) {
        setSelectedIds(new Set([state.targetNodeId]))
      }
    }

    state.isPointerDown = false
    state.isDragging = false
    state.hasMovedPastThreshold = false
    setDraggingNodeIds(new Set())

    window.removeEventListener('mousemove', handleGlobalMouseMove)
    window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [handleGlobalMouseMove])

  // Mouse Down on Desktop Icon
  const handleIconMouseDown = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    setContextMenuPos(null)

    const isCtrl = e.ctrlKey || e.metaKey
    const isShift = e.shiftKey
    const isAlreadySelected = selectedIds.has(id)

    let currentSelected = new Set(selectedIds)

    if (isCtrl) {
      if (currentSelected.has(id)) currentSelected.delete(id)
      else currentSelected.add(id)
      setSelectedIds(new Set(currentSelected))
    } else if (isShift && selectedIds.size > 0) {
      const nodeIndexMap = new Map(nodes.map((n, idx) => [n.id, idx]))
      const lastSelected = Array.from(selectedIds).pop()
      const startIdx = nodeIndexMap.get(lastSelected!) ?? 0
      const endIdx = nodeIndexMap.get(id) ?? 0
      const minIdx = Math.min(startIdx, endIdx)
      const maxIdx = Math.max(startIdx, endIdx)
      nodes.slice(minIdx, maxIdx + 1).forEach((n) => currentSelected.add(n.id))
      setSelectedIds(new Set(currentSelected))
    } else if (!isAlreadySelected) {
      currentSelected = new Set([id])
      setSelectedIds(currentSelected)
    }

    const dragNodes = currentSelected.has(id) ? Array.from(currentSelected) : [id]

    const initialPositions: Record<string, { x: number; y: number }> = {}
    dragNodes.forEach((nodeId) => {
      initialPositions[nodeId] = positions[nodeId] || { x: 20, y: 20 }
    })

    dragStateRef.current = {
      isPointerDown: true,
      isDragging: false,
      hasMovedPastThreshold: false,
      pointerStart: { x: e.clientX, y: e.clientY },
      dragNodes,
      initialPositions,
      targetNodeId: id,
      wasAlreadySelected: isAlreadySelected,
      isCtrlOrShift: isCtrl || isShift,
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)
  }

  // Touch Start on Desktop Icon (Mobile Drag Support)
  const handleIconTouchStart = (id: string, e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    e.stopPropagation()
    setContextMenuPos(null)

    const touch = e.touches[0]
    const isAlreadySelected = selectedIds.has(id)
    const currentSelected = isAlreadySelected ? selectedIds : new Set([id])

    if (!isAlreadySelected) {
      setSelectedIds(currentSelected)
    }

    const dragNodes = Array.from(currentSelected)
    const initialPositions: Record<string, { x: number; y: number }> = {}
    dragNodes.forEach((nodeId) => {
      initialPositions[nodeId] = positions[nodeId] || { x: 20, y: 20 }
    })

    dragStateRef.current = {
      isPointerDown: true,
      isDragging: false,
      hasMovedPastThreshold: false,
      pointerStart: { x: touch.clientX, y: touch.clientY },
      dragNodes,
      initialPositions,
      targetNodeId: id,
      wasAlreadySelected: isAlreadySelected,
      isCtrlOrShift: false,
    }

    const handleTouchMove = (te: TouchEvent) => {
      if (te.touches.length !== 1) return
      const t = te.touches[0]
      handleGlobalMouseMove({
        clientX: t.clientX,
        clientY: t.clientY,
      } as MouseEvent)
    }

    const handleTouchEnd = () => {
      handleGlobalMouseUp()
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
  }

  // Canvas Background Click (Deselect & Marquee Selection Start)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return

    setContextMenuPos(null)
    if (!e.ctrlKey && !e.metaKey) {
      setSelectedIds(new Set())
    }

    const startX = e.clientX
    const startY = e.clientY

    setSelectionRect({ startX, startY, currentX: startX, currentY: startY })
    setIsDraggingMarquee(true)
  }

  // Marquee Drag Movement & Intersections
  useEffect(() => {
    const handleMarqueeMouseMove = (e: MouseEvent) => {
      if (!isDraggingMarquee) return

      const currentX = e.clientX
      const currentY = e.clientY

      setSelectionRect((prev) => (prev ? { ...prev, currentX, currentY } : null))

      const startX = selectionRect?.startX ?? currentX
      const startY = selectionRect?.startY ?? currentY

      const rectX = Math.min(startX, currentX)
      const rectY = Math.min(startY, currentY)
      const rectW = Math.abs(currentX - startX)
      const rectH = Math.abs(currentY - startY)

      if (rectW > 4 || rectH > 4) {
        const iconWidth = isLargeIcons ? 104 : 88
        const iconHeight = isLargeIcons ? 112 : 96
        const newlySelected = new Set<string>()

        nodes.forEach((node) => {
          const pos = positions[node.id]
          if (!pos) return

          const iconX = pos.x
          const iconY = pos.y

          const intersects =
            iconX < rectX + rectW &&
            iconX + iconWidth > rectX &&
            iconY < rectY + rectH &&
            iconY + iconHeight > rectY

          if (intersects) {
            newlySelected.add(node.id)
          }
        })

        setSelectedIds(newlySelected)
      }
    }

    const handleMarqueeMouseUp = () => {
      if (isDraggingMarquee) {
        setIsDraggingMarquee(false)
        setSelectionRect(null)
      }
    }

    if (isDraggingMarquee) {
      window.addEventListener('mousemove', handleMarqueeMouseMove)
      window.addEventListener('mouseup', handleMarqueeMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMarqueeMouseMove)
      window.removeEventListener('mouseup', handleMarqueeMouseUp)
    }
  }, [isDraggingMarquee, selectionRect?.startX, selectionRect?.startY, nodes, positions, isLargeIcons])

  // Viewport & Zoom Change Revalidation Observer
  useEffect(() => {
    let animationFrameId: number | null = null
    let timerId: ReturnType<typeof setTimeout> | null = null

    const handleRevalidate = () => {
      if (!canvasRef.current) return
      const canvasWidth = canvasRef.current.clientWidth || window.innerWidth
      const canvasHeight = canvasRef.current.clientHeight || (window.innerHeight - 48)
      const dims = getIconDimensions(canvasRef.current, isLargeIcons)

      setPositions((prev) => {
        const revalidated = revalidateDesktopLayout(
          nodes,
          prev,
          isLargeIcons,
          canvasWidth,
          canvasHeight,
          dims
        )

        let hasChanged = false
        for (const key of Object.keys(revalidated)) {
          if (
            !prev[key] ||
            Math.abs(prev[key].x - revalidated[key].x) > 0.5 ||
            Math.abs(prev[key].y - revalidated[key].y) > 0.5
          ) {
            hasChanged = true
            break
          }
        }

        if (hasChanged) {
          try {
            sessionStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(revalidated))
          } catch (e) {}
          return revalidated
        }
        return prev
      })
    }

    const onResizeOrZoom = () => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
        animationFrameId = requestAnimationFrame(handleRevalidate)
      }, 50)
    }

    onResizeOrZoom()

    window.addEventListener('resize', onResizeOrZoom)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResizeOrZoom)
    }

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && canvasRef.current) {
      resizeObserver = new ResizeObserver(onResizeOrZoom)
      resizeObserver.observe(canvasRef.current)
    }

    return () => {
      if (timerId) clearTimeout(timerId)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', onResizeOrZoom)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onResizeOrZoom)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [nodes, isLargeIcons])

  // Right Click Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
  }

  // Context Menu Actions
  const handleRefresh = () => {
    setSelectedIds(new Set())
    setRefreshKey((k) => k + 1)
    const screenH = window.innerHeight - 48
    const defaults = computeDefaultPositions(nodes, isLargeIcons, screenH)
    setPositions(defaults)
    try {
      sessionStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(defaults))
    } catch (e) {}
  }

  const handleSortByName = () => {
    const sorted = [...nodes].sort((a, b) => a.name.localeCompare(b.name))
    setNodes(sorted)
    const screenH = window.innerHeight - 48
    const defaults = computeDefaultPositions(sorted, isLargeIcons, screenH)
    setPositions(defaults)
    try {
      sessionStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(defaults))
    } catch (e) {}
  }

  const handleSortByType = () => {
    const sorted = [...nodes].sort((a, b) => a.type.localeCompare(b.type))
    setNodes(sorted)
    const screenH = window.innerHeight - 48
    const defaults = computeDefaultPositions(sorted, isLargeIcons, screenH)
    setPositions(defaults)
    try {
      sessionStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(defaults))
    } catch (e) {}
  }

  const handleToggleIconSize = () => {
    const nextLarge = !isLargeIcons
    setIsLargeIcons(nextLarge)
    if (canvasRef.current) {
      const canvasWidth = canvasRef.current.clientWidth || window.innerWidth
      const canvasHeight = canvasRef.current.clientHeight || (window.innerHeight - 48)
      setPositions((prev) =>
        revalidateDesktopLayout(nodes, prev, nextLarge, canvasWidth, canvasHeight)
      )
    }
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

      {/* Desktop Icons Canvas (VFS Data with Absolute Positioning & Session Drag) */}
      <motion.div
        key={refreshKey}
        initial={{ opacity: 0.2, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full h-full"
      >
        {nodes.map((node) => (
          <DesktopIcon
            key={node.id}
            node={node}
            isSelected={selectedIds.has(node.id)}
            isDragging={draggingNodeIds.has(node.id)}
            position={positions[node.id]}
            onSelect={handleSelectIcon}
            onOpen={handleOpenNode}
            onMouseDown={handleIconMouseDown}
            onTouchStart={handleIconTouchStart}
            isJustDragged={() => Date.now() - dragEndTimestampRef.current < 250}
            isLargeIcons={isLargeIcons}
          />
        ))}
      </motion.div>

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


