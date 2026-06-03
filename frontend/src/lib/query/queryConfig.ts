/** Thời gian coi dữ liệu còn “mới” — tránh refetch khi đổi tab / quay lại trang */
export const DEFAULT_QUERY_STALE_TIME_MS = 5 * 60_000

/** Giữ cache sau khi unmount component */
export const DEFAULT_QUERY_GC_TIME_MS = 30 * 60_000
