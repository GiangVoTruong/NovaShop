export const CATEGORY_TONE = {
  electronics: 'cyan',
  fashion: 'pink',
  gaming: 'purple',
  office: 'emerald',
  home: 'amber',
  beauty: 'fuchsia',
} as const

export const CATEGORY_LABEL = {
  electronics: 'Điện tử',
  fashion: 'Thời trang',
  gaming: 'Gaming',
  office: 'Văn phòng',
  home: 'Nhà cửa',
  beauty: 'Làm đẹp',
} as const

export const CATEGORY_GLOW: Record<keyof typeof CATEGORY_TONE, string> = {
  electronics: 'glow-cyan',
  fashion: 'glow-pink',
  gaming: 'glow-purple',
  office: 'glow-emerald',
  home: 'glow-orange',
  beauty: 'glow-pink',
}
