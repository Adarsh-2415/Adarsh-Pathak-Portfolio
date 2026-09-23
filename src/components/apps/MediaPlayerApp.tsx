import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Expand,
  Shrink,
  Film,
  RotateCcw,
  AlertTriangle,
  Gauge,
  Loader2,
} from 'lucide-react'
import type { WindowState } from '@/types'

interface MediaPlayerAppProps {
  windowState: WindowState
}

export const MediaPlayerApp: React.FC<MediaPlayerAppProps> = ({ windowState }) => {
  const videoUrl = windowState.metadata?.mediaUrl || '/Test Video.mp4'
  const title = windowState.metadata?.title || windowState.title || 'Media Player'

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Dynamic playback & UI state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isBuffering, setIsBuffering] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false)
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true)
  const [hoverTime, setHoverTime] = useState<{ time: number; posPercent: number } | null>(null)

  // Reset state on video URL change
  useEffect(() => {
    setHasError(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [videoUrl])

  // Playback controls auto-hide logic (fades out after 2.5s of inactivity when playing)
  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false)
        setShowSpeedMenu(false)
      }, 2500)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      setIsControlsVisible(true)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    } else {
      handleMouseMove()
    }
  }, [isPlaying, handleMouseMove])

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current || hasError) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => setHasError(true))
    }
  }

  // HTML5 Video Event Listeners
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration || 0)
    setDimensions({
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    })
    setIsBuffering(false)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime || 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const newTime = parseFloat(e.target.value)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const posPercent = (e.clientX - rect.left) / rect.width
    const time = Math.max(0, Math.min(duration, posPercent * duration))
    setHoverTime({ time, posPercent: posPercent * 100 })
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (videoRef.current) {
      videoRef.current.volume = newVol
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMute = !isMuted
    setIsMuted(nextMute)
    videoRef.current.muted = nextMute
  }

  const handleSetSpeed = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
    setShowSpeedMenu(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') {
        togglePlay()
      } else if (e.key === 'm') {
        toggleMute()
      } else if (e.key === 'f') {
        toggleFullscreen()
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, isMuted, isFullscreen])

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const fileExt = title.includes('.') ? title.split('.').pop()?.toUpperCase() : 'MP4'

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`flex-1 w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'
      }`}
    >
      {/* Top Application Bar */}
      <AnimatePresence>
        {(isControlsVisible || !isPlaying) && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-10 px-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md z-20"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <Film size={16} className="text-cyan-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200 truncate" title={title}>
                {title}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
                {fileExt}
              </span>
              {dimensions && (
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/8 shrink-0">
                  {dimensions.width} × {dimensions.height}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {duration > 0 && (
                <span className="text-[11px] font-mono text-slate-400 shrink-0 pr-1">
                  {formatTime(duration)}
                </span>
              )}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                {isFullscreen ? <Shrink size={15} /> : <Expand size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Video Presentation Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
        {hasError ? (
          /* Error Fallback Card */
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 max-w-sm z-10">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Unable to Play Video</p>
              <p className="text-xs font-mono text-slate-400 break-all">{videoUrl}</p>
            </div>
            <button
              onClick={() => {
                setHasError(false)
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
              className="px-4 py-2 rounded-[var(--radius-control)] bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-200 transition cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw size={14} />
              <span>Retry Playback</span>
            </button>
          </div>
        ) : (
          <>
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              onClick={togglePlay}
              onDoubleClick={toggleFullscreen}
              preload="metadata"
              className="w-full h-full max-w-full max-h-full object-contain cursor-pointer"
            />

            {/* Buffering Spinner */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/30 backdrop-blur-xs">
                <Loader2 size={36} className="text-cyan-400 animate-spin stroke-[2]" />
              </div>
            )}

            {/* Large Center Play Overlay Button when Paused */}
            {!isPlaying && !isBuffering && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={togglePlay}
                title="Play Video"
                aria-label="Play Video"
                className="absolute w-16 h-16 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-slate-950 backdrop-blur-md shadow-2xl flex items-center justify-center pl-1 cursor-pointer transition-transform duration-200 hover:scale-110 z-10"
              >
                <Play size={28} className="fill-slate-950" />
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Floating Bottom Media Controls */}
      {!hasError && (
        <AnimatePresence>
          {(isControlsVisible || !isPlaying) && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-2xl"
            >
              <div className="bg-slate-900/85 backdrop-blur-xl border border-white/12 shadow-2xl rounded-2xl p-3 space-y-2 text-xs">
                {/* Progress Scrubber with Hover Time Tooltip */}
                <div
                  className="relative group cursor-pointer py-1"
                  onMouseMove={handleTimelineHover}
                  onMouseLeave={() => setHoverTime(null)}
                >
                  {/* Hover time tooltip */}
                  {hoverTime && (
                    <div
                      className="absolute -top-7 transform -translate-x-1/2 bg-black/80 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 shadow-md pointer-events-none"
                      style={{ left: `${hoverTime.posPercent}%` }}
                    >
                      {formatTime(hoverTime.time)}
                    </div>
                  )}

                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
                    aria-label="Video timeline seek slider"
                  />
                </div>

                {/* Main Controls Row */}
                <div className="flex items-center justify-between">
                  {/* Left Play/Pause & Timecode */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={togglePlay}
                      title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition shadow cursor-pointer shrink-0"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} className="pl-0.5" />}
                    </button>

                    <span className="font-mono text-slate-300 text-[11px]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Actions: Speed Dropdown, Volume, Fullscreen */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Playback Speed Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        title="Playback Speed"
                        className="px-2 py-1 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center space-x-1 transition cursor-pointer text-[11px] font-mono border border-white/8"
                      >
                        <Gauge size={13} className="text-cyan-400" />
                        <span>{playbackSpeed}×</span>
                      </button>

                      <AnimatePresence>
                        {showSpeedMenu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 6 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 bottom-8 w-28 bg-slate-900 border border-white/12 rounded-[var(--radius-popup)] p-1 shadow-2xl z-50 space-y-0.5"
                          >
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSetSpeed(speed)}
                                className={`w-full text-left px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer flex items-center justify-between ${
                                  playbackSpeed === speed
                                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span>{speed === 1 ? '1.0× (Normal)' : `${speed}×`}</span>
                                {playbackSpeed === speed && <span className="text-[10px]">✓</span>}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-1 sm:space-x-1.5">
                      <button
                        onClick={toggleMute}
                        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={16} className="text-rose-400" />
                        ) : (
                          <Volume2 size={16} className="text-cyan-400" />
                        )}
                      </button>

                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-14 sm:w-20 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 hidden xs:block"
                        aria-label="Volume level slider"
                      />
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                      className="p-1.5 rounded-[var(--radius-control)] text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      {isFullscreen ? <Shrink size={16} /> : <Expand size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
