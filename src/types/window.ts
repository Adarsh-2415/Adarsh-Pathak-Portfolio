import type { AppId, VFSMetadata } from './vfs'

export interface WindowPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

export interface WindowState {
  id: string
  appId: AppId
  title: string
  iconType: string
  position: WindowPosition
  size: WindowSize
  prevPosition?: WindowPosition
  prevSize?: WindowSize
  zIndex: number
  isOpen: boolean
  isFocused: boolean
  isMinimized: boolean
  isMaximized: boolean
  isPinned?: boolean
  metadata?: VFSMetadata
}

export type WindowSnapTarget = 'left' | 'right' | 'maximize' | 'restore'
