import React from 'react'

export interface SelectionRect {
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface DesktopSelectionBoxProps {
  rect: SelectionRect | null
}

/**
 * DesktopSelectionBox
 * Windows 11-inspired translucent selection rectangle for desktop multi-selection marquee.
 */
export const DesktopSelectionBox: React.FC<DesktopSelectionBoxProps> = ({ rect }) => {
  if (!rect) return null

  const x = Math.min(rect.startX, rect.currentX)
  const y = Math.min(rect.startY, rect.currentY)
  const width = Math.abs(rect.currentX - rect.startX)
  const height = Math.abs(rect.currentY - rect.startY)

  // Avoid rendering tiny 1-2px jitter
  if (width < 3 && height < 3) return null

  return (
    <div
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="pointer-events-none absolute z-20 rounded-[2px] bg-[rgba(56,189,248,0.14)] border border-[rgba(56,189,248,0.55)] shadow-[0_0_10px_rgba(56,189,248,0.15)]"
      aria-hidden="true"
    />
  )
}
