import React from 'react'

/**
 * AmbientFallbackBackground
 * Lightweight, high-performance CSS atmospheric background used when:
 * - WebGL is unavailable or failed to initialize
 * - prefers-reduced-motion is active
 * - High Performance / battery saver mode is selected
 */
export const AmbientFallbackBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep Mica atmospheric gradient base */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 15%, rgba(30, 58, 110, 0.28) 0%, rgba(13, 20, 36, 0.85) 60%, #060912 100%),
            radial-gradient(circle at 15% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 70%, rgba(14, 116, 144, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
            #060912
          `,
        }}
      />

      {/* Central vignette protecting the Sign-In reading zone */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.75)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
    </div>
  )
}
