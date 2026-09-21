import React, { useState } from 'react'
import { Mail, Phone, Code2, Share2, MapPin, Copy, Check, ExternalLink } from 'lucide-react'
import type { WindowState } from '@/types'
import { contactData } from '@/data/content'

interface ContactAppProps {
  windowState: WindowState
}

export const ContactApp: React.FC<ContactAppProps> = () => {
  const { email, phone, github, linkedin, location } = contactData
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-transparent text-slate-100 overflow-y-auto select-none p-6 sm:p-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-[var(--radius-window)] bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border border-white/10 space-y-2 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Get in Touch
        </h1>
        <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-lg">
          Reach out for collaborations, project inquiries, engineering roles, or creative technical discussions.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Channel */}
        <div className="p-5 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
              <Mail size={16} />
              <span>Email</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate pt-1 font-mono">
              {email || 'Pending email details'}
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="px-3 py-1.5 rounded-[var(--radius-control)] bg-cyan-500 hover:bg-cyan-400 text-xs font-medium text-slate-950 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Mail size={13} />
                <span>Send Email</span>
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">Email pending</span>
            )}
            {email && (
              <button
                onClick={() => handleCopy(email, 'email')}
                className="px-2.5 py-1.5 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center space-x-1 transition cursor-pointer"
              >
                {copiedField === 'email' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Phone Channel */}
        <div className="p-5 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
              <Phone size={16} />
              <span>Phone</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate pt-1 font-mono">
              {phone || 'Pending phone details'}
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="px-3 py-1.5 rounded-[var(--radius-control)] bg-sky-500 hover:bg-sky-400 text-xs font-medium text-slate-950 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Phone size={13} />
                <span>Call Phone</span>
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">Phone pending</span>
            )}
          </div>
        </div>

        {/* GitHub Channel */}
        <div className="p-5 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
              <Code2 size={16} />
              <span>GitHub</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate pt-1 font-mono">
              {github || 'Pending GitHub handle'}
            </p>
          </div>

          <div className="pt-2">
            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-[var(--radius-control)] bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white inline-flex items-center space-x-1.5 transition cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Open GitHub</span>
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">GitHub pending</span>
            )}
          </div>
        </div>

        {/* LinkedIn Channel */}
        <div className="p-5 rounded-[var(--radius-window)] bg-slate-900/60 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              <Share2 size={16} />
              <span>LinkedIn</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate pt-1 font-mono">
              {linkedin || 'Pending LinkedIn profile'}
            </p>
          </div>

          <div className="pt-2">
            {linkedin ? (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-[var(--radius-control)] bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white inline-flex items-center space-x-1.5 transition cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Open LinkedIn</span>
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">LinkedIn pending</span>
            )}
          </div>
        </div>
      </div>

      {/* Location Bar */}
      {location && (
        <div className="p-4 rounded-[var(--radius-window)] bg-slate-900/40 border border-white/5 flex items-center space-x-2.5 text-xs text-slate-400">
          <MapPin size={16} className="text-cyan-400 shrink-0" />
          <span>Location: <strong className="text-slate-200 font-sans">{location}</strong></span>
        </div>
      )}
    </div>
  )
}
