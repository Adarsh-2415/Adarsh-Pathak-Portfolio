import React, { useState, useRef, useEffect } from 'react'
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
} from 'lucide-react'
import type { WindowState } from '@/types'

interface MediaPlayerAppProps {
  windowState: WindowState
}

export const MediaPlayerApp: React.FC<MediaPlayerAppProps> = ({ windowState }) => {
  const videoUrl = windowState.metadata?.mediaUrl || '/Test Video.mp4'
  const title = windowState.metadata?.title || windowState.title || 'Media Player'

  const videoRef = useRef<HTMLVideoElement>(null)

  // Live video playback state derived dynamically from HTML5 Video element
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const playerContainerRef = useRef<HTMLDivElement>(null)

  // Reset state when video source changes
  useEffect(() => {
    setHasError(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [videoUrl])

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

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // Format seconds into MM:SS format
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={playerContainerRef}
      className={`flex-1 w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'
      }`}
    >
      {/* Top Header / Application Bar */}
      <div className="h-10 px-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md">
        <div className="flex items-center space-x-2 min-w-0">
          <Film size={16} className="text-cyan-400 shrink-0" />
          <span className="text-xs font-medium text-slate-200 truncate" title={title}>
            {title}
          </span>
          {dimensions && (
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
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
      </div>

      {/* Main Video Presentation Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
        {hasError ? (
          /* Error Fallback Card */
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
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
              className="px-3.5 py-1.5 rounded-[var(--radius-control)] bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-200 transition cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw size={13} />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          /* HTML5 Video Element */
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => setHasError(true)}
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            preload="metadata"
            className="w-full h-full max-w-full max-h-full object-contain cursor-pointer"
          />
        )}
      </div>

      {/* Video Control Bar Footer */}
      {!hasError && (
        <div className="p-2 sm:p-3 px-3 sm:px-4 bg-slate-900/90 border-t border-white/10 flex flex-col space-y-2 shrink-0 backdrop-blur-md">
          {/* Progress Slider */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
              aria-label="Video seek progress"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-xs">
            {/* Left Play/Pause & Timecode */}
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition shadow cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="pl-0.5" />}
              </button>

              <span className="font-mono text-slate-300 text-[11px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Volume Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
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
                className="w-16 sm:w-20 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 hidden xs:block"
                aria-label="Volume level"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
