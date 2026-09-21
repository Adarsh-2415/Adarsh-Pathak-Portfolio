import React from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'
import type { WindowState } from '@/types'

interface PdfViewerAppProps {
  windowState: WindowState
}

export const PdfViewerApp: React.FC<PdfViewerAppProps> = ({ windowState }) => {
  const pdfUrl = windowState.metadata?.downloadUrl || '/resume.pdf'
  const title = windowState.metadata?.title || windowState.title

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-transparent text-slate-100 overflow-hidden select-none">
      {/* Top Application Toolbar */}
      <div className="h-11 px-4 bg-slate-900/40 border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-sm">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <FileText size={18} className="text-rose-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate font-sans">
            {title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new browser tab"
            className="px-2.5 py-1 rounded-[var(--radius-control)] bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Open Tab</span>
          </a>

          <a
            href={pdfUrl}
            download
            title="Download PDF document"
            className="px-3 py-1 rounded-[var(--radius-control)] bg-cyan-500 hover:bg-cyan-400 text-xs font-medium text-slate-950 flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
          >
            <Download size={13} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Main Native PDF Frame */}
      <div className="flex-1 w-full h-full relative bg-slate-950">
        <iframe
          src={`${pdfUrl}#toolbar=1`}
          title={title}
          className="w-full h-full border-none"
        />
      </div>
    </div>
  )
}
