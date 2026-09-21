import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

/**
 * Windows 11-inspired Folder Silhouette
 * Front flap with depth, rear folder backplate, and internal document tab.
 */
export const WindowsFolderIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="win-folder-back" x1="8" y1="12" x2="56" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#d99b26" />
        <stop offset="1" stopColor="#b47814" />
      </linearGradient>
      <linearGradient id="win-folder-paper" x1="16" y1="16" x2="48" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f8fafc" />
        <stop offset="1" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="win-folder-front" x1="6" y1="24" x2="58" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffca42" />
        <stop offset="0.6" stopColor="#f5b82e" />
        <stop offset="1" stopColor="#d99918" />
      </linearGradient>
      <filter id="win-folder-shadow" x="2" y="20" width="60" height="38" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>
    
    {/* Folder Back Tab */}
    <path
      d="M8 17C8 14.7909 9.79086 13 12 13H24.5C26.1 13 27.6 13.8 28.5 15.1L31.5 19H52C54.2091 19 56 20.7909 56 23V46C56 48.2091 54.2091 50 52 50H12C9.79086 50 8 48.2091 8 46V17Z"
      fill="url(#win-folder-back)"
    />

    {/* Folder Paper Inside */}
    <rect x="14" y="18" width="36" height="22" rx="2" fill="url(#win-folder-paper)" opacity="0.9" />
    <line x1="18" y1="23" x2="32" y2="23" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="27" x2="44" y2="27" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />

    {/* Folder Front Flap */}
    <g filter="url(#win-folder-shadow)">
      <path
        d="M6 27C6 24.7909 7.79086 23 10 23H54C56.2091 23 58 24.7909 58 27V47C58 49.2091 56.2091 51 54 51H10C7.79086 51 6 49.2091 6 47V27Z"
        fill="url(#win-folder-front)"
      />
    </g>
    
    {/* Front Flap Specular Highlight */}
    <path
      d="M10 24H54C55.6569 24 57 25.3431 57 27V28C57 26.3431 55.6569 25 54 25H10C8.34315 25 7 26.3431 7 28V27C7 25.3431 8.34315 24 10 24Z"
      fill="#fff"
      fillOpacity="0.3"
    />
  </svg>
)

/**
 * Windows 11-inspired Code / Project File
 */
export const WindowsCodeFileIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-code-grad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284c7" />
        <stop offset="1" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <rect x="12" y="8" width="40" height="48" rx="6" fill="url(#win-code-grad)" />
    <path d="M12 14C12 10.6863 14.6863 8 18 8H46C49.3137 8 52 10.6863 52 14V15H12V14Z" fill="#38bdf8" fillOpacity="0.4" />
    <path d="M26 27L20 32L26 37" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38 27L44 32L38 37" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="34" y1="25" x2="30" y2="39" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

/**
 * Windows 11-inspired Design Studio File
 */
export const WindowsDesignFileIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-design-grad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <rect x="12" y="8" width="40" height="48" rx="6" fill="url(#win-design-grad)" />
    <circle cx="25" cy="24" r="5" fill="#fbcfe8" />
    <path d="M16 46L27 34L37 42L43 36L48 46H16Z" fill="#c4b5fd" />
  </svg>
)

/**
 * Windows 11-inspired Video File
 */
export const WindowsVideoFileIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-video-grad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0d9488" />
        <stop offset="1" stopColor="#115e59" />
      </linearGradient>
    </defs>
    <rect x="12" y="8" width="40" height="48" rx="6" fill="url(#win-video-grad)" />
    <circle cx="32" cy="32" r="12" fill="#14b8a6" fillOpacity="0.4" />
    <path d="M29 26L39 32L29 38V26Z" fill="#fff" />
  </svg>
)

/**
 * Windows 11-inspired Document / PDF File
 */
export const WindowsDocFileIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-doc-grad" x1="14" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="1" stopColor="#be123c" />
      </linearGradient>
    </defs>
    <rect x="13" y="8" width="38" height="48" rx="5" fill="#f8fafc" />
    <rect x="13" y="8" width="38" height="14" rx="5" fill="url(#win-doc-grad)" />
    <rect x="18" y="28" width="28" height="3" rx="1.5" fill="#94a3b8" />
    <rect x="18" y="35" width="22" height="3" rx="1.5" fill="#cbd5e1" />
    <rect x="18" y="42" width="26" height="3" rx="1.5" fill="#cbd5e1" />
    <text x="21" y="19" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
  </svg>
)

/**
 * Windows 11-inspired SysInfo / System File
 */
export const WindowsSysInfoIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-sys-grad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    <rect x="12" y="8" width="40" height="48" rx="6" fill="url(#win-sys-grad)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
    <rect x="22" y="18" width="20" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
    <circle cx="32" cy="28" r="4" fill="#38bdf8" />
    <line x1="26" y1="14" x2="26" y2="18" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="32" y1="14" x2="32" y2="18" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="38" y1="14" x2="38" y2="18" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="26" y1="38" x2="26" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="32" y1="38" x2="32" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="38" y1="38" x2="38" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="18" y1="28" x2="22" y2="28" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="42" y1="28" x2="46" y2="28" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="20" y1="47" x2="44" y2="47" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/**
 * Windows 11-inspired Contact / Connect File
 */
export const WindowsContactIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-contact-grad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#4338ca" />
      </linearGradient>
    </defs>
    <rect x="10" y="12" width="44" height="40" rx="6" fill="url(#win-contact-grad)" />
    <circle cx="32" cy="26" r="6" fill="#ffffff" />
    <path d="M22 42C22 37.5817 26.4772 34 32 34C37.5228 34 42 37.5817 42 42" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/**
 * Windows 11-inspired Recycle Bin (Empty)
 */
export const WindowsRecycleBinIcon: React.FC<IconProps> = ({ size = 48, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="win-trash-grad" x1="16" y1="18" x2="48" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#64748b" stopOpacity="0.8" />
        <stop offset="1" stopColor="#334155" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path d="M22 14H42M25 14V11C25 10.4 25.4 10 26 10H38C38.6 10 39 10.4 39 11V14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    <rect x="16" y="14" width="32" height="4" rx="2" fill="#94a3b8" />
    <path d="M19 18L22 51C22.2 52.7 23.6 54 25.3 54H38.7C40.4 54 41.8 52.7 42 51L45 18H19Z" fill="url(#win-trash-grad)" />
    <line x1="26" y1="24" x2="27" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="32" y1="24" x2="32" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="38" y1="24" x2="37" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
)

/**
 * Workspace Launcher Emblem
 * Original geometric emblem evoking the familiar bottom-dock launcher
 * without copying Microsoft's trademarked 4-square Windows logo.
 */
export const WorkspaceLauncherIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" fillOpacity="0.9" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="var(--accent)" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="var(--accent)" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" fillOpacity="0.9" />
  </svg>
)

export const WindowsStartIcon = WorkspaceLauncherIcon


/**
 * Window Controls: Minimize, Maximize, Restore, Close
 */
export const MinimizeGlyph: React.FC = () => (
  <svg width="10" height="1" viewBox="0 0 10 1" fill="none">
    <rect width="10" height="1" fill="currentColor" />
  </svg>
)

export const MaximizeGlyph: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" />
  </svg>
)

export const RestoreGlyph: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <rect x="2.5" y="0.5" width="7" height="7" stroke="currentColor" strokeWidth="1" />
    <path d="M0.5 2.5V9.5H7.5" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
)

export const CloseGlyph: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M0.5 0.5L9.5 9.5M9.5 0.5L0.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
