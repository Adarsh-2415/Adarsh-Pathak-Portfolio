export type FileType =
  | 'folder'
  | 'website'
  | 'app'
  | 'image'
  | 'video'
  | 'document'
  | 'system'
  | 'contact'
  | 'trash'

export type AppId =
  | 'explorer'
  | 'browser'
  | 'image-viewer'
  | 'media-player'
  | 'doc-viewer'
  | 'sysinfo'
  | 'timeline'
  | 'contact'
  | 'terminal'

export interface VFSMetadata {
  title?: string
  subtitle?: string
  description?: string
  technologies?: string[]
  liveUrl?: string
  githubUrl?: string
  previewImage?: string
  mediaUrl?: string
  mediaType?: 'image' | 'video' | 'pdf'
  aspectRatio?: string
  toolsUsed?: string[]
  downloadUrl?: string
  featured?: boolean
  role?: string
}

export interface VFSNode {
  id: string
  name: string
  type: FileType
  parentId: string | null
  iconType: 'folder' | 'website' | 'app' | 'image' | 'video' | 'pdf' | 'sysinfo' | 'contact' | 'trash'
  dateModified: string
  appHandler: AppId
  metadata?: VFSMetadata
}
