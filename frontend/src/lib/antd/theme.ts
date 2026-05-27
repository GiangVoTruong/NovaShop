import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#d946ef',
    colorInfo: '#6366f1',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 12,
    fontFamily: "Sora, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  components: {
    Button: { controlHeight: 42, borderRadius: 14 },
    Input: { controlHeight: 44, borderRadius: 14 },
    Select: { controlHeight: 44, borderRadius: 14 },
    Pagination: {
      itemActiveBg: '#d946ef',
      itemActiveColor: '#ffffff',
      colorPrimary: '#d946ef',
      colorPrimaryHover: '#c026d3',
    },
  },
}
