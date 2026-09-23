import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Expand,
  Shrink,
  Image as ImageIcon,
  Move,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Folder,
} from 'lucide-react'
import type { WindowState, VFSNode } from '@/types'
import { vfsAllNodes, getBreadcrumbs } from '@/data/vfs'

interface ImageViewerAppProps {
  windowState: WindowState
}

export const ImageViewerApp: React.FC<ImageViewerAppProps> = ({ windowState }) => {
  // Determine initial node and media list
  const initialNodeId = windowState.id.replace('win-', '')
  const initialNode = vfsAllNodes.find(
    (n) => n.id === initialNodeId || n.metadata?.mediaUrl === windowState.metadata?.mediaUrl
  )

  const [activeNode, setActiveNode] = useState<VFSNode | null>(initialNode || null)
  const imageUrl = activeNode?.metadata?.mediaUrl || windowState.metadata?.mediaUrl || '/Social%20Media/1.png'
  const title = activeNode?.name || windowState.metadata?.title || windowState.title || 'Design Image'

  // Image zoom & pan state
  const [zoom, setZoom] = useState<number>(1.0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false)
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Sibling image list navigation derived dynamically from VFS
  const siblingImages: VFSNode[] = React.useMemo(() => {
    if (!activeNode || !activeNode.parentId) return []
    return vfsAllNodes.filter(
      (n) => n.parentId === activeNode.parentId && (n.type === 'image' || n.appHandler === 'image-viewer')
    )
  }, [activeNode])

  const currentIndex = siblingImages.findIndex((n) => n.id === activeNode?.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < siblingImages.length - 1

  const handlePrevImage = useCallback(() => {
    if (hasPrev) {
      setActiveNode(siblingImages[currentIndex - 1])
      setZoom(1.0)
      setPan({ x: 0, y: 0 })
      setDimensions(null)
    }
  }, [hasPrev, siblingImages, currentIndex])

  const handleNextImage = useCallback(() => {
    if (hasNext) {
      setActiveNode(siblingImages[currentIndex + 1])
      setZoom(1.0)
      setPan({ x: 0, y: 0 })
      setDimensions(null)
    }
  }, [hasNext, siblingImages, currentIndex])

  // Reset pan when zooming back to <= 1.0
  useEffect(() => {
    if (zoom <= 1.0) {
      setPan({ x: 0, y: 0 })
    }
  }, [zoom])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      } else if (e.key === 'Escape') {
        if (isFullscreenMode) setIsFullscreenMode(false)
        if (showInfoPanel) setShowInfoPanel(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevImage, handleNextImage, isFullscreenMode, showInfoPanel])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 5.0))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.25))
  }

  const handleFitToWindow = () => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
  }

  const handleImageDoubleClick = () => {
    if (zoom === 1.0) {
      setZoom(2.0)
    } else {
      handleFitToWindow()
    }
  }

  // Mouse wheel zoom handling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 5.0))
    } else {
      setZoom((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.25))
    }
  }

  // Drag / Pan logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1.0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1.0) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    const maxOffset = Math.max(100, (zoom - 1) * 300)
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, newX))
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, newY))

    setPan({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch support for drag/pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1.0 || e.touches.length !== 1) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1.0 || e.touches.length !== 1) return
    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y
    const maxOffset = Math.max(100, (zoom - 1) * 300)
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // File type ext detection
  const fileExt = title.includes('.') ? title.split('.').pop()?.toUpperCase() : 'IMAGE'
  const breadcrumbs = activeNode ? getBreadcrumbs(activeNode.id) : []

  return (
    <div
      className={`flex-1 w-full h-full flex flex-col bg-slate-950/90 text-slate-100 select-none overflow-hidden font-sans ${
        isFullscreenMode ? 'fixed inset-0 z-50 bg-slate-950' : 'relative'
      }`}
    >
      {/* Top Application Bar */}
      <div className="h-10 px-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md z-10">
        {/* Title & Identity */}
        <div className="flex items-center space-x-2 min-w-0">
          <ImageIcon size={15} className="text-cyan-400 shrink-0" />
          <span className="text-xs font-medium text-slate-200 truncate" title={title}>
            {title}
          </span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
            {fileExt}
          </span>
          {dimensions && (
            <span className="hidden md:inline-flex items-center text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/8 shrink-0">
              {dimensions.width} × {dimensions.height} px
            </span>
          )}
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            title="Image details"
            className={`p-1.5 rounded-[var(--radius-control)] cursor-pointer transition-colors ${
              showInfoPanel ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Info size={15} />
          </button>
          <button
            onClick={() => setIsFullscreenMode(!isFullscreenMode)}
            title={isFullscreenMode ? 'Exit Fullscreen View' : 'Fullscreen View'}
            className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            {isFullscreenMode ? <Shrink size={15} /> : <Expand size={15} />}
          </button>
        </div>
      </div>

      {/* Main Image Viewing Canvas Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex">
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`flex-1 relative w-full h-full overflow-hidden flex items-center justify-center bg-black/70 backdrop-blur-xs ${
            zoom > 1.0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
        >
          {/* Subtle radial grid pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Display Image */}
          <img
            key={imageUrl}
            src={imageUrl}
            alt={title}
            onDoubleClick={handleImageDoubleClick}
            onLoad={(e) => {
              setDimensions({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              })
            }}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="max-w-full max-h-full object-contain pointer-events-auto select-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          />

          {/* Pan Indicator Hint */}
          {zoom > 1.0 && (
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-sans text-slate-300 flex items-center space-x-1.5 pointer-events-none opacity-80 z-10">
              <Move size={12} className="text-cyan-400" />
              <span>Drag to pan</span>
            </div>
          )}

          {/* Floating Bottom Control Dock */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[92vw]">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-white/12 shadow-2xl rounded-full px-3 py-1.5 flex items-center space-x-1 sm:space-x-2 text-xs">
              {/* Previous / Next Sibling Image Arrows */}
              {siblingImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    disabled={!hasPrev}
                    title="Previous Image (Left Arrow)"
                    className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/12 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    disabled={!hasNext}
                    title="Next Image (Right Arrow)"
                    className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/12 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <div className="h-4 w-px bg-white/12 mx-0.5" />
                </>
              )}

              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.25}
                title="Zoom Out"
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/12 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
              >
                <ZoomOut size={15} />
              </button>

              <span
                onClick={handleFitToWindow}
                title="Reset Zoom to 100%"
                className="text-xs font-mono text-cyan-300 min-w-[42px] text-center cursor-pointer hover:underline px-1 py-0.5 rounded hover:bg-white/10 transition"
              >
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 5.0}
                title="Zoom In"
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/12 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
              >
                <ZoomIn size={15} />
              </button>

              <div className="h-4 w-px bg-white/12 mx-0.5" />

              {/* Fit & Fullscreen Actions */}
              <button
                onClick={handleFitToWindow}
                title="Fit to Window"
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/12 cursor-pointer transition flex items-center space-x-1"
              >
                <RotateCcw size={14} />
                <span className="text-[11px] hidden sm:inline">Fit</span>
              </button>

              <button
                onClick={() => setIsFullscreenMode(!isFullscreenMode)}
                title={isFullscreenMode ? 'Exit Fullscreen' : 'Fullscreen'}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/12 cursor-pointer transition"
              >
                {isFullscreenMode ? <Shrink size={15} /> : <Expand size={15} />}
              </button>

              <button
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                title="Image Info"
                className={`p-1.5 rounded-full cursor-pointer transition ${
                  showInfoPanel ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-300 hover:text-white hover:bg-white/12'
                }`}
              >
                <Info size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right-Side Image Details Slide-Over Panel */}
        <AnimatePresence>
          {showInfoPanel && (
            <motion.aside
              initial={{ x: 280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-72 bg-slate-900/90 border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto shrink-0 backdrop-blur-xl z-30 shadow-2xl text-xs"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-semibold text-white tracking-wide uppercase font-mono text-[11px]">
                    Image Information
                  </span>
                  <button
                    onClick={() => setShowInfoPanel(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Details list */}
                <div className="space-y-3 font-sans">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">File Name</span>
                    <p className="font-medium text-slate-100 break-all">{title}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">File Format</span>
                    <p className="font-medium text-slate-100">{fileExt} Image</p>
                  </div>

                  {dimensions && (
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">Dimensions</span>
                      <p className="font-mono text-cyan-300">
                        {dimensions.width} × {dimensions.height} pixels
                      </p>
                    </div>
                  )}

                  {breadcrumbs.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">Location</span>
                      <div className="flex items-center space-x-1 text-slate-300 pt-0.5">
                        <Folder size={13} className="text-amber-400 shrink-0" />
                        <span className="truncate">{breadcrumbs.map((b) => b.name).join(' / ')}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Public Path</span>
                    <p className="font-mono text-[10px] text-slate-400 break-all bg-black/40 p-1.5 rounded border border-white/8 mt-1 select-all">
                      {imageUrl}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer hint */}
              <div className="pt-4 border-t border-white/10 text-[10px] text-slate-400 font-mono text-center">
                VFS Image Asset • Genuine Portfolio Work
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Status Bar */}
      <div className="h-6 px-3 bg-black/40 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0 backdrop-blur-xs z-10">
        <div className="flex items-center space-x-2">
          <span>{fileExt} File</span>
          {dimensions && <span>• {dimensions.width}×{dimensions.height}</span>}
          {siblingImages.length > 1 && (
            <span>
              • {currentIndex + 1} of {siblingImages.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>{Math.round(zoom * 100)}% Zoom</span>
          <span className="hidden sm:inline">• Double-click to toggle zoom</span>
        </div>
      </div>
    </div>
  )
}
