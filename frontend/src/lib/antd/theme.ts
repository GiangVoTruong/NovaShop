import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4f46e5',
    colorInfo: '#0ea5e9',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily: "Sora, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  components: {
    Button: { controlHeight: 42, borderRadius: 14 },
    Input: { controlHeight: 44, borderRadius: 14 },
    Select: { controlHeight: 44, borderRadius: 14 },
  },
}
