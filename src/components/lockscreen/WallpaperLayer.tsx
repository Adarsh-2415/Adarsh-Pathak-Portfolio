import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WallpaperDefinition {
  id: string
  name: string
  backgroundStyle: string
}

/**
 * Curated collection of 5 original, dark, atmospheric Windows-inspired wallpapers.
 * Pure CSS layered gradients with rich depth, zero external asset latency,
 * and complete visual compatibility with white/slate interface typography.
 */
export const curatedWallpapers: WallpaperDefinition[] = [
  {
    id: 'mica-aurora',
    name: 'Mica Aurora',
    backgroundStyle:
      'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(30, 58, 110, 0.4) 0%, rgba(15, 23, 42, 0.85) 60%, #060911 100%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 50%), radial-gradient(circle at 15% 75%, rgba(99, 102, 241, 0.1) 0%, transparent 45%), #060911',
  },
  {
    id: 'indigo-horizon',
    name: 'Indigo Horizon',
    backgroundStyle:
      'radial-gradient(ellipse 90% 70% at 50% 10%, rgba(49, 46, 129, 0.45) 0%, rgba(15, 23, 42, 0.9) 65%, #05070e 100%), radial-gradient(circle at 75% 60%, rgba(129, 140, 248, 0.09) 0%, transparent 50%), #05070e',
  },
  {
    id: 'obsidian-wave',
    name: 'Obsidian Wave',
    backgroundStyle:
      'radial-gradient(circle at 35% 25%, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 55%, #07090f 100%), radial-gradient(circle at 70% 85%, rgba(51, 65, 85, 0.4) 0%, transparent 60%), #07090f',
  },
  {
    id: 'cobalt-depth',
    name: 'Cobalt Depth',
    backgroundStyle:
      'radial-gradient(ellipse 75% 65% at 50% 30%, rgba(14, 116, 144, 0.22) 0%, rgba(15, 23, 42, 0.85) 60%, #04060c 100%), radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 40%), #04060c',
  },
  {
    id: 'twilight-mesh',
    name: 'Twilight Mesh',
    backgroundStyle:
      'radial-gradient(circle at 60% 20%, rgba(76, 29, 149, 0.3) 0%, rgba(15, 23, 42, 0.9) 60%, #070710 100%), radial-gradient(circle at 20% 40%, rgba(30, 58, 110, 0.35) 0%, transparent 50%), #070710',
  },
]

interface WallpaperLayerProps {
  changeIntervalSec?: number
  isDimmed?: boolean
}

export const WallpaperLayer: React.FC<WallpaperLayerProps> = ({
  changeIntervalSec = 50,
  isDimmed = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % curatedWallpapers.length)
    }, changeIntervalSec * 1000)

    return () => clearInterval(timer)
  }, [changeIntervalSec])

  const currentWallpaper = curatedWallpapers[currentIndex]

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentWallpaper.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          style={{ background: currentWallpaper.backgroundStyle }}
          className="absolute inset-0 w-full h-full"
        />
      </AnimatePresence>

      {/* Central vignette overlay to guarantee high-contrast legibility for text & UI cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.65)_100%)]" />

      {/* Dimmed state overlay for sleep or shutdown transitions */}
      <motion.div
        animate={{ opacity: isDimmed ? 0.92 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#04060a] z-10 pointer-events-none"
      />
    </div>
  )
}
