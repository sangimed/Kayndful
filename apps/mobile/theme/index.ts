export type Gradient = readonly [string, string];

export const colors = {
  brand: {
    iconGradient: ['#FFD9BE', '#F7BFC0'] as const,
    primaryGradient: ['#A8D5FF', '#b1e0ff'] as const,
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    surfaceStrong: '#F1F5F9',
  },
  semantic: {
    success: '#16a34a',
    danger: '#dc2626',
    successGradient: ['#BBF7D0', '#22C55E'] as const,
    dangerGradient: ['#FECACA', '#EF4444'] as const,
    neutral: '#0f172a',
  },
  shadow: {
    brand: {
      color: '#000',
      opacity: 0.2,
      radius: 16,
      offsetY: 12,
      elevation: 12,
    },
    primaryBtn: {
      color: '#60A5FA',
      opacity: 0.35,
      radius: 10,
      offsetY: 8,
      elevation: 6,
    },
  },
  white: '#FFFFFF',
  gray: '#F3F4F6',
  overlay: 'rgba(15,23,42,0.55)',
} as const;

export const radius = {
  xl: 36,
  lg: 20,
  md: 15,
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
} as const;
