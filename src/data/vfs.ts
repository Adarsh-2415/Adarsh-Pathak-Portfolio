import type { VFSNode } from '@/types'

/**
 * Adarsh Pathak Personal Workspace Virtual File System (VFS)
 * Note: Only structural hierarchy and authentic data points are defined.
 * No fabricated projects or fake metrics are included.
 */
export const vfsAllNodes: VFSNode[] = [
  {
    id: 'folder-design',
    name: 'Design',
    type: 'folder',
    parentId: null,
    iconType: 'folder',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'Design',
      description: 'Graphic design, UI/UX explorations, and visual media.',
    },
  },
  {
    id: 'folder-design-sm',
    name: 'Social Media',
    type: 'folder',
    parentId: 'folder-design',
    iconType: 'folder',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'Social Media Design',
      description: 'Social media visual designs and promotional graphics.',
    },
  },
  {
    id: 'design-sm-1',
    name: '1.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '1.png',
      mediaUrl: '/Social%20Media/1.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-2',
    name: '2.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '2.png',
      mediaUrl: '/Social%20Media/2.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-3',
    name: '3.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '3.png',
      mediaUrl: '/Social%20Media/3.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-4',
    name: '4.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '4.png',
      mediaUrl: '/Social%20Media/4.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-5',
    name: '5.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '5.png',
      mediaUrl: '/Social%20Media/5.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-6',
    name: '6.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '6.png',
      mediaUrl: '/Social%20Media/6.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-7',
    name: '7.png',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: '7.png',
      mediaUrl: '/Social%20Media/7.png',
      mediaType: 'image',
    },
  },
  {
    id: 'design-sm-funngro',
    name: 'Funngro.jpg',
    type: 'image',
    parentId: 'folder-design-sm',
    iconType: 'image',
    dateModified: '',
    appHandler: 'image-viewer',
    metadata: {
      title: 'Funngro.jpg',
      mediaUrl: '/Social%20Media/Funngro.jpg',
      mediaType: 'image',
    },
  },
  {
    id: 'folder-design-flex',
    name: 'Flex',
    type: 'folder',
    parentId: 'folder-design',
    iconType: 'folder',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'Flex Design',
      description: 'Flex banners, signage, and display print designs.',
    },
  },
  {
    id: 'folder-website',
    name: 'Website',
    type: 'folder',
    parentId: null,
    iconType: 'folder',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'Website Projects',
      description: 'Web applications and interactive site projects built by Adarsh.',
    },
  },
  {
    id: 'site-quickway-ride',
    name: 'Quickway Ride',
    type: 'website',
    parentId: 'folder-website',
    iconType: 'website',
    dateModified: '2025-02-15',
    appHandler: 'browser',
    metadata: {
      title: 'Quickway Ride',
      liveUrl: 'https://quickwayride.com',
    },
  },
  {
    id: 'site-pesmos',
    name: 'PESMOS',
    type: 'website',
    parentId: 'folder-website',
    iconType: 'website',
    dateModified: '2025-02-15',
    appHandler: 'browser',
    metadata: {
      title: 'PESMOS',
      liveUrl: 'https://pesmos.org',
    },
  },
  {
    id: 'site-greenwood-roorkee',
    name: 'Greenwood Roorkee',
    type: 'website',
    parentId: 'folder-website',
    iconType: 'website',
    dateModified: '2025-02-15',
    appHandler: 'browser',
    metadata: {
      title: 'Greenwood Roorkee',
      liveUrl: 'https://greenwoodroorkee.org',
    },
  },
  {
    id: 'site-fsir',
    name: 'FSIR',
    type: 'website',
    parentId: 'folder-website',
    iconType: 'website',
    dateModified: '2025-02-15',
    appHandler: 'browser',
    metadata: {
      title: 'FSIR',
      liveUrl: 'https://fsir.in',
    },
  },
  {
    id: 'folder-ai-graphic',
    name: 'AI Graphic Design',
    type: 'folder',
    parentId: null,
    iconType: 'image',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'AI Graphic Design',
      description: 'Graphic design works generated and created using AI tools.',
    },
  },
  {
    id: 'folder-ai-video',
    name: 'AI Video',
    type: 'folder',
    parentId: null,
    iconType: 'video',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'AI Video',
      description: 'AI-created and AI-generated video and motion work.',
    },
  },
  {
    id: 'video-test-video',
    name: 'Test Video.mp4',
    type: 'video',
    parentId: 'folder-ai-video',
    iconType: 'video',
    dateModified: '',
    appHandler: 'media-player',
    metadata: {
      title: 'Test Video.mp4',
      mediaUrl: '/Test Video.mp4',
      mediaType: 'video',
    },
  },
  {
    id: 'file-resume',
    name: 'Resume.pdf',
    type: 'document',
    parentId: null,
    iconType: 'pdf',
    dateModified: '2025-02-15',
    appHandler: 'doc-viewer',
    metadata: {
      title: 'Adarsh Pathak — Resume',
      description: 'Official resume document.',
      downloadUrl: '/resume.pdf',
    },
  },
  {
    id: 'file-about',
    name: 'About Me',
    type: 'system',
    parentId: null,
    iconType: 'sysinfo',
    dateModified: '2025-02-15',
    appHandler: 'sysinfo',
    metadata: {
      title: 'About Adarsh Pathak',
      description: 'Personal introduction and developer context.',
    },
  },
  {
    id: 'file-contact',
    name: 'Contact Me',
    type: 'contact',
    parentId: null,
    iconType: 'contact',
    dateModified: '2025-02-15',
    appHandler: 'contact',
    metadata: {
      title: 'Contact & Connect',
      description: 'Get in touch for collaborations and opportunities.',
    },
  },
  {
    id: 'node-this-pc',
    name: 'This PC',
    type: 'system',
    parentId: null,
    iconType: 'sysinfo',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'This PC',
      description: 'Portfolio workspace overview.',
    },
  },
  {
    id: 'trash-recycle-bin',
    name: 'Recycle Bin',
    type: 'trash',
    parentId: null,
    iconType: 'trash',
    dateModified: '2025-02-15',
    appHandler: 'explorer',
    metadata: {
      title: 'Recycle Bin',
      description: 'Recycle Bin workspace item.',
    },
  },
]

export const vfsRootNodes: VFSNode[] = vfsAllNodes.filter((node) => node.parentId === null)

export const getChildNodes = (parentId: string | null): VFSNode[] => {
  return vfsAllNodes.filter((node) => node.parentId === parentId)
}

export const getNodeById = (id: string): VFSNode | undefined => {
  return vfsAllNodes.find((node) => node.id === id)
}

export const getBreadcrumbs = (nodeId: string | null): { id: string; name: string }[] => {
  if (!nodeId) return [{ id: 'root', name: 'This PC' }]
  const path: { id: string; name: string }[] = []
  let current: VFSNode | undefined = getNodeById(nodeId)
  while (current) {
    path.unshift({ id: current.id, name: current.name })
    if (!current.parentId) break
    current = getNodeById(current.parentId)
  }
  path.unshift({ id: 'root', name: 'This PC' })
  return path
}
