import React from 'react'
import { motion } from 'framer-motion'

interface StartupNodeAnimationProps {
  stepIndex?: number
}

/**
 * StartupNodeAnimation
 * Compact abstract "digital workspace core" visualization.
 * Structure:
 *          ○
 *          │
 *     ○ ───●─── ○
 *          │
 *          ○
 *
 * Sequence:
 * 0.0s Central workspace core fades in.
 * 0.3s Connection ports appear.
 * 0.6s Satellite nodes appear.
 * 0.9s Thin connection lines draw outward.
 * 1.2s Subtle data-flow pulses travel through the connections.
 * 1.6s Satellite nodes activate and stabilize.
 * 2.0s Subtle radial activation wave.
 * 2.4s Settled architectural constellation.
 */
export const StartupNodeAnimation: React.FC<StartupNodeAnimationProps> = ({ stepIndex = 0 }) => {
  return (
    <div
      className="relative w-44 h-32 flex items-center justify-center select-none"
      role="img"
      aria-label="Digital workspace architecture core initializing"
    >
      <svg
        viewBox="0 0 180 140"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle line gradient */}
          <linearGradient id="core-line-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="core-line-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
          </linearGradient>

          {/* Restrained accent glow */}
          <filter id="core-subtle-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.38" />
          </filter>
        </defs>

        {/* --- 45-degree subtle circuit accent guides (Depth layer) --- */}
        <g opacity="0.25">
          <circle cx="90" cy="70" r="38" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" strokeDasharray="2 4" />
          {/* Diagonal corner micro-ticks */}
          <circle cx="63" cy="43" r="1.2" fill="#94a3b8" />
          <circle cx="117" cy="43" r="1.2" fill="#94a3b8" />
          <circle cx="63" cy="97" r="1.2" fill="#94a3b8" />
          <circle cx="117" cy="97" r="1.2" fill="#94a3b8" />
        </g>

        {/* --- Connection Lines (Draw outward from core) --- */}
        {/* North Line: (90, 54) to (90, 28) */}
        <motion.line
          x1="90"
          y1="54"
          x2="90"
          y2="28"
          stroke="url(#core-line-v)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.45, delay: 0.85, ease: 'easeOut' }}
        />

        {/* South Line: (90, 86) to (90, 112) */}
        <motion.line
          x1="90"
          y1="86"
          x2="90"
          y2="112"
          stroke="url(#core-line-v)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.45, delay: 0.9, ease: 'easeOut' }}
        />

        {/* West Line: (74, 70) to (48, 70) */}
        <motion.line
          x1="74"
          y1="70"
          x2="48"
          y2="70"
          stroke="url(#core-line-h)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.45, delay: 0.8, ease: 'easeOut' }}
        />

        {/* East Line: (106, 70) to (132, 70) */}
        <motion.line
          x1="106"
          y1="70"
          x2="132"
          y2="70"
          stroke="url(#core-line-h)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.45, delay: 0.95, ease: 'easeOut' }}
        />

        {/* --- Traveling Data-Flow Pulses (Outward along connections at 1.2s) --- */}
        {/* North Pulse */}
        <motion.circle
          r="1.8"
          fill="#38bdf8"
          filter="url(#core-subtle-glow)"
          initial={{ cy: 54, opacity: 0 }}
          animate={{
            cy: [54, 28],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: 0.7,
            delay: 1.2,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut',
          }}
          cx="90"
        />

        {/* South Pulse */}
        <motion.circle
          r="1.8"
          fill="#38bdf8"
          filter="url(#core-subtle-glow)"
          initial={{ cy: 86, opacity: 0 }}
          animate={{
            cy: [86, 112],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: 0.7,
            delay: 1.25,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut',
          }}
          cx="90"
        />

        {/* West Pulse */}
        <motion.circle
          r="1.8"
          fill="#818cf8"
          filter="url(#core-subtle-glow)"
          initial={{ cx: 74, opacity: 0 }}
          animate={{
            cx: [74, 48],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: 0.7,
            delay: 1.15,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut',
          }}
          cy="70"
        />

        {/* East Pulse */}
        <motion.circle
          r="1.8"
          fill="#38bdf8"
          filter="url(#core-subtle-glow)"
          initial={{ cx: 106, opacity: 0 }}
          animate={{
            cx: [106, 132],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: 0.7,
            delay: 1.3,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: 'easeInOut',
          }}
          cy="70"
        />

        {/* --- 4 Satellite Nodes (○ at cardinal points) --- */}
        {/* North Node: (90, 22) */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="origin-[90px_22px]"
        >
          <circle
            cx="90"
            cy="22"
            r="6"
            fill="#0b1120"
            stroke={stepIndex >= 1 ? '#38bdf8' : 'rgba(255,255,255,0.18)'}
            strokeWidth="1.2"
            className="transition-colors duration-500"
          />
          <motion.circle
            cx="90"
            cy="22"
            r="2"
            fill="#38bdf8"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: stepIndex >= 1 ? 0.95 : 0.4 }}
            transition={{ duration: 0.4 }}
          />
        </motion.g>

        {/* South Node: (90, 118) */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="origin-[90px_118px]"
        >
          <circle
            cx="90"
            cy="118"
            r="6"
            fill="#0b1120"
            stroke={stepIndex >= 2 ? '#818cf8' : 'rgba(255,255,255,0.18)'}
            strokeWidth="1.2"
            className="transition-colors duration-500"
          />
          <motion.circle
            cx="90"
            cy="118"
            r="2"
            fill="#818cf8"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: stepIndex >= 2 ? 0.95 : 0.4 }}
            transition={{ duration: 0.4 }}
          />
        </motion.g>

        {/* West Node: (42, 70) */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="origin-[42px_70px]"
        >
          <circle
            cx="42"
            cy="70"
            r="6"
            fill="#0b1120"
            stroke={stepIndex >= 1 ? '#38bdf8' : 'rgba(255,255,255,0.18)'}
            strokeWidth="1.2"
            className="transition-colors duration-500"
          />
          <motion.circle
            cx="42"
            cy="70"
            r="2"
            fill="#38bdf8"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: stepIndex >= 1 ? 0.95 : 0.4 }}
            transition={{ duration: 0.4 }}
          />
        </motion.g>

        {/* East Node: (138, 70) */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="origin-[138px_70px]"
        >
          <circle
            cx="138"
            cy="70"
            r="6"
            fill="#0b1120"
            stroke={stepIndex >= 3 ? '#38bdf8' : 'rgba(255,255,255,0.18)'}
            strokeWidth="1.2"
            className="transition-colors duration-500"
          />
          <motion.circle
            cx="138"
            cy="70"
            r="2"
            fill="#38bdf8"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: stepIndex >= 3 ? 0.95 : 0.4 }}
            transition={{ duration: 0.4 }}
          />
        </motion.g>

        {/* --- Central Workspace Core (● at 90, 70) --- */}
        {/* Subtle radial activation wave at ~2.0s */}
        <motion.circle
          cx="90"
          cy="70"
          r="16"
          stroke="#38bdf8"
          strokeWidth="1"
          fill="none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.9, 1.45],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.4,
            delay: 1.9,
            repeat: Infinity,
            repeatDelay: 1.6,
            ease: 'easeOut',
          }}
          className="origin-[90px_70px]"
        />

        {/* Connection Ports on Core Perimeter (Appear at 0.3s) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <circle cx="90" cy="54" r="1.5" fill="#38bdf8" />
          <circle cx="90" cy="86" r="1.5" fill="#38bdf8" />
          <circle cx="74" cy="70" r="1.5" fill="#38bdf8" />
          <circle cx="106" cy="70" r="1.5" fill="#38bdf8" />
        </motion.g>

        {/* Outer Core Rim */}
        <motion.circle
          cx="90"
          cy="70"
          r="15"
          fill="#080d1a"
          stroke="rgba(56, 189, 248, 0.45)"
          strokeWidth="1.2"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="origin-[90px_70px]"
        />

        {/* Inner Core Solid Nucleus (●) */}
        <motion.circle
          cx="90"
          cy="70"
          r="6.5"
          fill="#38bdf8"
          filter="url(#core-subtle-glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="origin-[90px_70px]"
        />

        {/* Core Center White Micro-dot */}
        <motion.circle
          cx="90"
          cy="70"
          r="2"
          fill="#ffffff"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 0.25, delay: 0.2 }}
        />
      </svg>
    </div>
  )
}
