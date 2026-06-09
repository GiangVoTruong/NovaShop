import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { getAccessToken } from '@/lib/axios/instances'
import { getWebSocketUrl } from '@/lib/websocket/getWebSocketUrl'
import type { AppNotification } from '@/types/notification.types'
import { Client } from '@stomp/stompjs'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import SockJS from 'sockjs-client'
import {
  applyIncomingNotification,
  applyRealtimeSideEffects,
} from '../lib/notificationQueryKeys'

const NOTIFICATION_SUBSCRIPTION = '/user/queue/notifications'

function normalizeNotificationPayload(body: string): AppNotification | null {
  try {
    const payload = JSON.parse(body) as Record<string, unknown>
    const rawId = payload.id
    const title = payload.title

    if (rawId == null || typeof title !== 'string') {
      return null
    }

    const id = typeof rawId === 'string' ? rawId : String(rawId)

    return {
      id,
      type: (payload.type as AppNotification['type']) ?? 'SYSTEM',
      title,
      message: typeof payload.message === 'string' ? payload.message : '',
      isRead: Boolean(payload.isRead ?? payload.read ?? false),
      createdAt:
        typeof payload.createdAt === 'string'
          ? payload.createdAt
          : new Date().toISOString(),
    }
  } catch (error) {
    console.error('[NotificationWebSocket] Failed to parse message:', error)
    return null
  }
}

export function useNotificationWebSocket() {
  const { isAuthenticated, user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return
    }

    const client = new Client({
      webSocketFactory: () => {
        const accessToken = getAccessToken()
        return new SockJS(getWebSocketUrl(accessToken))
      },
      reconnectDelay: 5_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      beforeConnect: () => {
        const accessToken = getAccessToken()
        if (!accessToken) {
          return Promise.reject(new Error('Missing access token for WebSocket'))
        }

        client.connectHeaders = {
          Authorization: `Bearer ${accessToken}`,
          token: accessToken,
        }
        return Promise.resolve()
      },
      onConnect: () => {
        client.subscribe(NOTIFICATION_SUBSCRIPTION, (message) => {
          const notification = normalizeNotificationPayload(message.body)
          if (!notification) {
            return
          }

          applyIncomingNotification(queryClient, user.id, notification)
          applyRealtimeSideEffects(queryClient, notification)
        })
      },
      onStompError: (frame) => {
        console.error('[NotificationWebSocket] STOMP error:', frame.headers.message ?? frame.body)
      },
      onWebSocketError: (event) => {
        console.error('[NotificationWebSocket] WebSocket error:', event)
      },
    })

    client.activate()

    return () => {
      void client.deactivate()
    }
  }, [isAuthenticated, queryClient, user?.id])
}
