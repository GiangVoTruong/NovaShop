import { getAccessToken } from '@/lib/axios/instances'
import { getWebSocketUrl } from '@/lib/websocket/getWebSocketUrl'
import type { AppNotification } from '@/types/notification.types'
import { Client } from '@stomp/stompjs'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import SockJS from 'sockjs-client'
import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { NOTIFICATION_INBOX_QUERY_ROOT } from './useNotifications'

const NOTIFICATION_SUBSCRIPTION = '/user/websocket/notifications'

function parseNotificationPayload(body: string): AppNotification | null {
  try {
    const payload = JSON.parse(body) as AppNotification
    if (!payload?.id || !payload?.title) {
      return null
    }
    return payload
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
      webSocketFactory: () => new SockJS(getWebSocketUrl()),
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
        }
        return Promise.resolve()
      },
      onConnect: () => {
        client.subscribe(NOTIFICATION_SUBSCRIPTION, (message) => {
          const notification = parseNotificationPayload(message.body)
          if (!notification) {
            return
          }

          queryClient.invalidateQueries({ queryKey: NOTIFICATION_INBOX_QUERY_ROOT })
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
