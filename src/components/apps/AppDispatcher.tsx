import React from 'react'
import type { WindowState } from '@/types'
import { FileExplorerApp } from './FileExplorerApp'
import { AboutMeApp } from './AboutMeApp'
import { ContactApp } from './ContactApp'
import { PdfViewerApp } from './PdfViewerApp'
import { ThisPcApp } from './ThisPcApp'
import { RecycleBinApp } from './RecycleBinApp'
import { BrowserApp } from './BrowserApp'
import { ImageViewerApp } from './ImageViewerApp'
import { MediaPlayerApp } from './MediaPlayerApp'

interface AppDispatcherProps {
  windowState: WindowState
}

export const AppDispatcher: React.FC<AppDispatcherProps> = ({ windowState }) => {
  const { appId, id } = windowState

  switch (appId) {
    case 'sysinfo':
      return <AboutMeApp windowState={windowState} />

    case 'contact':
      return <ContactApp windowState={windowState} />

    case 'doc-viewer':
      return <PdfViewerApp windowState={windowState} />

    case 'browser':
      return <BrowserApp windowState={windowState} />

    case 'image-viewer':
      return <ImageViewerApp windowState={windowState} />

    case 'media-player':
      return <MediaPlayerApp windowState={windowState} />

    case 'explorer':
      if (id === 'win-node-this-pc' || id.includes('this-pc')) {
        return <ThisPcApp windowState={windowState} />
      }
      if (id === 'win-trash-recycle-bin' || id.includes('recycle-bin')) {
        return <RecycleBinApp windowState={windowState} />
      }
      return <FileExplorerApp windowState={windowState} />

    default:
      return <FileExplorerApp windowState={windowState} />
  }
}
