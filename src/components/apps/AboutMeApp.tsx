import React from 'react'
import { Sparkles, Code, Layout } from 'lucide-react'
import type { WindowState } from '@/types'
import { profileData } from '@/data/content'
import { ProfileMonogram } from '@/components/lockscreen/ProfileMonogram'

interface AboutMeAppProps {
  windowState: WindowState
}

export const AboutMeApp: React.FC<AboutMeAppProps> = () => {
  const { name, role, location, headline, about, coreSkills } = profileData

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-transparent text-slate-100 overflow-y-auto select-none p-6 sm:p-8 space-y-6">
      {/* Hero Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 rounded-[var(--radius-window)] bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-white/10 shadow-xl">
        <div className="shrink-0 drop-shadow-2xl">
          <ProfileMonogram size="lg" />
        </div>
        <div className="text-center sm:text-left space-y-1.5 overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {name}
          </h1>
          <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase font-mono">
            {role} {location ? `• ${location}` : ''}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-sans pt-1">
            {headline}
          </p>
        </div>
      </div>

      {/* Introduction Paragraphs */}
      <div className="p-6 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3 shadow-inner">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
          <Sparkles size={14} />
          <span>Personal Overview</span>
        </div>
        {about.map((paragraph, idx) => (
          <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Focus Areas & Core Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Languages & Frameworks */}
        <div className="p-5 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
            <Code size={14} />
            <span>Development Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...coreSkills.languages, ...coreSkills.frameworks].map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 font-sans"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Tools & Design Engineering */}
        <div className="p-5 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
            <Layout size={14} />
            <span>Design &amp; Tools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...coreSkills.tools, ...coreSkills.design].map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-xs text-sky-200 font-sans"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
