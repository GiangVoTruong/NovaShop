import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { PATHS } from '@/router/paths'

export default function ErrorBoundary() {
  const error = useRouteError()

  const { status, title, detail } = parseError(error)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm uppercase tracking-widest text-neutral-500">
        Lỗi {status}
      </p>
      <h1 className="text-3xl font-semibold">{title}</h1>
      {detail && (
        <pre className="max-w-xl overflow-auto rounded-md bg-neutral-100 p-4 text-left text-sm dark:bg-neutral-900">
          {detail}
        </pre>
      )}
      <Link
        to={PATHS.HOME}
        className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
      >
        Về trang chủ
      </Link>
    </main>
  )
}

function parseError(error: unknown): {
  status: number | string
  title: string
  detail?: string
} {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.statusText || 'Đã có lỗi xảy ra',
      detail: typeof error.data === 'string' ? error.data : undefined,
    }
  }
  if (error instanceof Error) {
    return { status: 500, title: error.message, detail: error.stack }
  }
  return { status: 'Unknown', title: 'Đã có lỗi không xác định' }
}
