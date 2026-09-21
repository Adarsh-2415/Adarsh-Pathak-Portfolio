import React from 'react'

interface ProfileMonogramProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  useMonogram?: boolean
}

export const ProfileMonogram: React.FC<ProfileMonogramProps> = ({
  size = 'lg',
  className = '',
  useMonogram = false,
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-28 h-28 sm:w-32 sm:h-32 text-3xl sm:text-4xl',
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none shadow-2xl ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label="Adarsh Pathak Profile Avatar"
    >
      {/* Outer subtle glow & Windows 11-style border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-white/10 to-white/5 p-[2px] shadow-[0_12px_36px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {useMonogram ? (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800/95 to-slate-900/95">
              {/* Inner concentric ring */}
              <div className="absolute inset-2 rounded-full border border-white/[0.06]" />
              {/* Subtle ambient gradient */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[var(--accent-subtle)] blur-lg" />
              {/* Monogram Text */}
              <span className="relative font-bold tracking-wider text-slate-100 font-sans">
                A<span className="text-[var(--accent)]">P</span>
              </span>
            </div>
          ) : (
            <img
              src="/Logo.jpg"
              alt="Adarsh Pathak"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none scale-[1.02]"
              loading="eager"
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
