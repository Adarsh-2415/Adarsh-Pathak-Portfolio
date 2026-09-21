import React, { useState, useRef, useEffect } from 'react'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Expand,
  Shrink,
  Image as ImageIcon,
  Move,
} from 'lucide-react'
import type { WindowState } from '@/types'

interface ImageViewerAppProps {
  windowState: WindowState
}

export const ImageViewerApp: React.FC<ImageViewerAppProps> = ({ windowState }) => {
  const imageUrl = windowState.metadata?.mediaUrl || '/Funngro.jpg'
  const title = windowState.metadata?.title || windowState.title || 'Design Image'

  // Image zoom & pan state
  const [zoom, setZoom] = useState<number>(1.0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Reset pan when zooming back to <= 1.0
  useEffect(() => {
    if (zoom <= 1.0) {
      setPan({ x: 0, y: 0 })
    }
  }, [zoom])

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

    // Sensible boundary limits based on zoom level
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

  return (
    <div
      className={`flex-1 w-full h-full flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans ${
        isFullscreenMode ? 'fixed inset-0 z-50 bg-slate-950/95' : 'relative'
      }`}
    >
      {/* Top Application Toolbar */}
      <div className="h-10 px-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md">
        {/* Title & Identity */}
        <div className="flex items-center space-x-2 min-w-0">
          <ImageIcon size={16} className="text-cyan-400 shrink-0" />
          <span className="text-xs font-medium text-slate-200 truncate" title={title}>
            {title}
          </span>
          {dimensions && (
            <span className="hidden sm:inline flex items-center text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/8 shrink-0">
              {dimensions.width} × {dimensions.height} px
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.25}
            title="Zoom out"
            className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ZoomOut size={15} />
          </button>

          <span
            onClick={handleFitToWindow}
            title="Click to reset zoom"
            className="text-xs font-mono text-cyan-300 min-w-[42px] text-center cursor-pointer hover:underline px-1 py-0.5 rounded hover:bg-white/5 transition-colors"
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 5.0}
            title="Zoom in"
            className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ZoomIn size={15} />
          </button>

          <div className="h-4 w-px bg-white/12 mx-1 hidden sm:block" />

          <button
            onClick={handleFitToWindow}
            title="Fit to window"
            className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors hidden sm:flex items-center gap-1 text-xs"
          >
            <RotateCcw size={14} />
            <span className="text-[11px] hidden md:inline">Fit</span>
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

      {/* Main Image Viewing Canvas */}
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
        className={`flex-1 relative w-full h-full overflow-hidden flex items-center justify-center bg-black/60 backdrop-blur-xs ${
          zoom > 1.0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        {/* Subtle checkered backdrop pattern to elevate transparency and framing */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Display Image */}
        <img
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
          className="max-w-full max-h-full object-contain pointer-events-auto select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
        />

        {/* Pan Indicator Hint overlay when zoomed */}
        {zoom > 1.0 && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-sans text-slate-300 flex items-center space-x-1.5 pointer-events-none opacity-80">
            <Move size={12} className="text-cyan-400" />
            <span>Drag to pan</span>
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className="h-6 px-3 bg-black/40 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0 backdrop-blur-xs">
        <div className="flex items-center space-x-2">
          <span>Image File</span>
          {dimensions && <span>• {dimensions.width}×{dimensions.height}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <span>{Math.round(zoom * 100)}% Zoom</span>
          <span className="hidden sm:inline">• Double-click to toggle zoom</span>
        </div>
      </div>
    </div>
  )
}
