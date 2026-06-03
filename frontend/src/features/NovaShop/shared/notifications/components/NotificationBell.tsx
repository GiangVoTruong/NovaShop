import { Popover, Spin } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from '../hooks/useNotifications'
import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'

dayjs.extend(relativeTime)

type NotificationBellProps = {
  className?: string
  badgeClassName?: string
  layout?: 'icon' | 'bottomNav'
  popoverPlacement?: 'bottomRight' | 'top'
}

export default function NotificationBell({
  className,
  badgeClassName,
  layout = 'icon',
  popoverPlacement = 'bottomRight',
}: NotificationBellProps) {
  const { t: translate } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const unreadQuery = useUnreadNotificationCount()
  const notificationsQuery = useNotifications(1, 20)
  const markAsReadMutation = useMarkNotificationRead()
  const markAllAsReadMutation = useMarkAllNotificationsRead()

  const isBottomNav = layout === 'bottomNav'
  const triggerClassName =
    className ??
    (isBottomNav
      ? 'relative flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 transition-all hover:text-slate-800'
      : 'relative flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100')
  const triggerBadgeClassName =
    badgeClassName ??
    (isBottomNav
      ? 'absolute -right-1.5 -top-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white'
      : 'absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-white')

  const unreadCount = unreadQuery.data ?? 0
  const notifications = notificationsQuery.data ?? []

  if (!isAuthenticated) {
    return null
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      void notificationsQuery.refetch()
      void unreadQuery.refetch()
    }
  }

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (isRead || markAsReadMutation.isPending) {
      return
    }
    markAsReadMutation.mutate(notificationId)
  }

  const content = (
    <div className="w-80 max-w-[calc(100vw-2rem)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-900">{translate('notifications.title')}</p>
        {unreadCount > 0 ? (
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            {translate('notifications.markAllRead')}
          </button>
        ) : null}
      </div>

      {notificationsQuery.isLoading ? (
        <div className="grid place-items-center py-8">
          <Spin size="small" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">{translate('notifications.empty')}</p>
      ) : (
        <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition hover:bg-slate-50 ${
                  notification.isRead
                    ? 'border-slate-100 bg-white'
                    : 'border-blue-100 bg-blue-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  {!notification.isRead ? (
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{notification.message}</p>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  {dayjs(notification.createdAt).fromNow()}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement={popoverPlacement}
      arrow={false}
    >
      <button type="button" className={triggerClassName} aria-label={translate('notifications.title')}>
        <span className={isBottomNav ? 'relative' : undefined}>
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className={triggerBadgeClassName}>{unreadCount > 99 ? '99+' : unreadCount}</span>
          ) : null}
        </span>
        {isBottomNav ? <span>{translate('bottomNav.notifications')}</span> : null}
      </button>
    </Popover>
  )
}
