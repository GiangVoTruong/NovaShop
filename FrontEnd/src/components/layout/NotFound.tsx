import { Link } from 'react-router-dom'
import { PATHS } from '@/router/paths'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm uppercase tracking-widest text-neutral-500">
        Lỗi 404
      </p>
      <h1 className="text-3xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-neutral-500">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        to={PATHS.HOME}
        className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
      >
        Về trang chủ
      </Link>
    </main>
  )
}
