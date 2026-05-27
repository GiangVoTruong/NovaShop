import { ConfigProvider, Table } from 'antd'
import type { TableProps } from 'antd'
import { adminTableAntdTheme } from '@/lib/antd/adminTheme'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { adminTablePagination } from '../constants/adminTableStyles'

export default function AdminTable<T extends object>({
  pagination = adminTablePagination,
  className,
  size = 'middle',
  bordered = false,
  ...tableProps
}: TableProps<T>) {
  return (
    <ConfigProvider theme={adminTableAntdTheme}>
      <div className={cx('admin-table-shell', className)}>
        <Table pagination={pagination} size={size} bordered={bordered} {...tableProps} />
      </div>
    </ConfigProvider>
  )
}
