import React, { Suspense, lazy } from 'react'
import { AmbientFallbackBackground } from './AmbientFallbackBackground'

/**
 * Single Source of Truth for Portfolio Wallpaper Asset Path.
 * Reused across Sign-In, Welcome, and Desktop screens.
 */
export const PORTFOLIO_WALLPAPER_PATH = '/wallpaper.jpeg'

/**
 * Central Background System Mode:
 * - 'wallpaper': Uses custom personal wallpaper image (/wallpaper.jpeg)
 * - 'ambient3d': Uses 3D procedural WebGL wave background (Ambient3DBackground)
 */
export type BackgroundMode = 'wallpaper' | 'ambient3d'

export const CURRENT_BACKGROUND_MODE: BackgroundMode = 'wallpaper'

const Ambient3DBackground = lazy(() =>
  import('./Ambient3DBackground').then((m) => ({
    default: m.Ambient3DBackground,
  }))
)

interface DesktopWallpaperBackgroundProps {
  isDimmed?: boolean
  isBlurred?: boolean
  forceMode?: BackgroundMode
}

/**
 * Unified Desktop & Workspace Wallpaper Component.
 * Renders full-screen high-resolution static wallpaper with crisp hardware acceleration
 * and Sign-In-only acrylic background layer blur (8px). Preserves 3D WebGL fallback capability.
 */
export const DesktopWallpaperBackground: React.FC<DesktopWallpaperBackgroundProps> = ({
  isDimmed = false,
  isBlurred = false,
  forceMode,
}) => {
  const activeMode = forceMode || CURRENT_BACKGROUND_MODE

  if (activeMode === 'ambient3d') {
    return (
      <Suspense fallback={<AmbientFallbackBackground />}>
        <Ambient3DBackground isDimmed={isDimmed} />
      </Suspense>
    )
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#05070e]"
      aria-hidden="true"
    >
      {/* High-Quality Hardware-Accelerated Desktop Wallpaper Image */}
      <img
        src={PORTFOLIO_WALLPAPER_PATH}
        alt=""
        style={{
          imageRendering: 'high-quality' as any,
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: isBlurred ? 'scale(1.04) translateZ(0)' : 'scale(1.0) translateZ(0)',
          filter: isBlurred ? 'blur(8px)' : 'none',
          transition: 'transform 500ms ease-out, filter 500ms ease-out',
        }}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Subtle Readability Overlay: light top/bottom gradient & soft center vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      {/* System Power State Dimming Overlay (Sleep / Shutdown transitions) */}
      <div
        className="absolute inset-0 bg-[#03050a] transition-opacity duration-700 ease-in-out z-10 pointer-events-none"
        style={{ opacity: isDimmed ? 0.92 : 0 }}
      />
    </div>
  )
}
