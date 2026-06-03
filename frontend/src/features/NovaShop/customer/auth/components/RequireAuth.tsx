import { Spin } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { useAuth } from '../hooks/useAuth'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const location = useLocation()

  if (isBootstrapping) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATHS.LOGIN}
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  return children
}
