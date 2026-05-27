import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
import { ADMIN_FONT_FAMILY, adminColors } from '@/features/NovaShop/admin/layout/constants/adminColors'

/** Theme tối cho shell admin (sidebar, toolbar input…) */
export const adminAntdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: adminColors.primary,
    colorInfo: adminColors.textSecondary,
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#fb7185',
    borderRadius: 12,
    colorBgContainer: adminColors.surface,
    colorBgElevated: '#1e293b',
    colorBorder: adminColors.border,
    colorText: adminColors.text,
    colorTextSecondary: adminColors.textSecondary,
    colorTextPlaceholder: adminColors.textMuted,
    fontFamily: ADMIN_FONT_FAMILY,
  },
  components: {
    Input: {
      controlHeight: 40,
      colorBgContainer: 'rgba(255, 255, 255, 0.05)',
      colorBorder: adminColors.border,
      activeBorderColor: adminColors.primary,
      hoverBorderColor: 'rgba(217, 70, 239, 0.45)',
    },
    Select: {
      controlHeight: 40,
      colorBgContainer: 'rgba(255, 255, 255, 0.05)',
      colorBorder: adminColors.border,
    },
    Pagination: {
      itemActiveBg: adminColors.primary,
      itemActiveColor: '#ffffff',
    },
  },
}

/** Theme bảng — cùng dark + accent fuchsia với shell */
export const adminTableAntdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: adminColors.primary,
    borderRadius: 8,
    colorBgContainer: 'transparent',
    colorText: adminColors.text,
    colorTextSecondary: adminColors.textSecondary,
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
      colorBgContainer: 'rgba(255, 255, 255, 0.05)',
    },
  },
}
