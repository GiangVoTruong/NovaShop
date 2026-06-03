import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
import { ADMIN_FONT_FAMILY, adminColors } from '@/features/NovaShop/admin/layout/constants/adminColors'

/** Theme sáng cho shell admin (Ant Design Pro clean) */
export const adminAntdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: adminColors.primary,
    colorLink: '#1d4ed8',
    colorLinkHover: '#1e40af',
    colorLinkActive: '#1e3a8a',
    colorInfo: adminColors.textSecondary,
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#fb7185',
    borderRadius: 12,
    colorBgContainer: adminColors.surface,
    colorBgElevated: '#ffffff',
    colorBorder: adminColors.border,
    colorText: '#0f172a',
    colorTextSecondary: adminColors.textSecondary,
    colorTextPlaceholder: adminColors.textMuted,
    fontFamily: ADMIN_FONT_FAMILY,
  },
  components: {
    Input: {
      controlHeight: 40,
      colorBgContainer: '#ffffff',
      colorBorder: adminColors.border,
      activeBorderColor: adminColors.primary,
      hoverBorderColor: 'rgba(37, 99, 235, 0.45)',
    },
    Select: {
      controlHeight: 40,
      colorBgContainer: '#ffffff',
      colorBorder: adminColors.border,
    },
    Pagination: {
      itemActiveBg: adminColors.primary,
      itemActiveColor: '#ffffff',
    },
  },
}

/** Theme bảng admin — đồng bộ shell sáng */
export const adminTableAntdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: adminColors.primary,
    colorLink: '#1d4ed8',
    colorLinkHover: '#1e40af',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
    colorBorder: adminColors.tableBorder,
    fontFamily: ADMIN_FONT_FAMILY,
  },
  components: {
    Table: {
      headerBg: adminColors.tableHeaderBg,
      rowHoverBg: adminColors.tableRowHover,
      borderColor: adminColors.tableBorder,
      headerColor: adminColors.textSecondary,
      colorBgContainer: 'transparent',
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
      headerSplitColor: adminColors.tableBorder,
    },
    Pagination: {
      itemActiveBg: adminColors.primary,
      itemActiveColor: '#ffffff',
      colorText: adminColors.textSecondary,
      colorBgContainer: '#ffffff',
    },
  },
}
