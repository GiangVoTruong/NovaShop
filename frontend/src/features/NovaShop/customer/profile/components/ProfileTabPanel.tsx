import type { ReactNode } from 'react'

type ProfileTabPanelProps = {
  tabId: string
  activeTab: string
  hasBeenVisited: boolean
  children: ReactNode
}

/** Giữ nội dung tab đã mở trong DOM (ẩn) để không remount → không refetch API */
export default function ProfileTabPanel({
  tabId,
  activeTab,
  hasBeenVisited,
  children,
}: ProfileTabPanelProps) {
  if (!hasBeenVisited) {
    return null
  }

  const isActive = activeTab === tabId

  return (
    <div className={isActive ? 'min-w-0' : 'hidden'} aria-hidden={!isActive}>
      {children}
    </div>
  )
}
