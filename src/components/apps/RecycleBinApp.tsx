import React from 'react'
import { Trash2 } from 'lucide-react'
import type { WindowState } from '@/types'

interface RecycleBinAppProps {
  windowState: WindowState
}

export const RecycleBinApp: React.FC<RecycleBinAppProps> = () => {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-transparent text-slate-100 select-none p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
        <Trash2 size={32} />
      </div>

      <div className="max-w-md space-y-1">
        <h2 className="text-base font-semibold text-white tracking-tight font-sans">
          Recycle Bin is empty
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          No discarded items or deleted drafts in current workspace build.
        </p>
      </div>

      <button
        disabled
        className="px-4 py-1.5 rounded-[var(--radius-control)] bg-white/5 border border-white/5 text-xs text-slate-500 font-medium cursor-not-allowed opacity-60"
      >
        Empty Recycle Bin
      </button>
    </div>
  )
}
