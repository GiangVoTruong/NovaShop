import { QueryClientProvider } from '@tanstack/react-query'
import { createAppQueryClient } from '@/lib/query/createQueryClient'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/NovaShop/customer/auth/context/AuthProvider'
import I18nProvider from '@/lib/i18n/I18nProvider'
import { router } from '@/router/router'
import './App.css'

const queryClient = createAppQueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
