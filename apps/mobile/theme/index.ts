export type Gradient = readonly [string, string];

export const colors = {
  brand: {
    iconGradient: ['#7C9BFF', '#5E7DFF'] as const,
    primaryGradient: ['#5E7DFF', '#4F6FFF'] as const,
    primary: '#4F6FFF',
    accent: '#7C9BFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    surfaceStrong: '#EEF2FF',
  },
  semantic: {
    success: '#16A34A',
    danger: '#DC2626',
    successGradient: ['#86EFAC', '#22C55E'] as const,
    dangerGradient: ['#FCA5A5', '#EF4444'] as const,
    neutral: '#0F172A',
  },
  app: {
    backgroundLight: '#F4F6FB',
    backgroundDark: '#0B1020',
    cardLight: '#FFFFFF',
    cardDark: '#111827',
    tintLight: 'rgba(79,111,255,0.08)',
    tintDark: 'rgba(124,155,255,0.14)',
  },
  shadow: {
    brand: {
      color: '#0F172A',
      opacity: 0.14,
      radius: 18,
      offsetY: 8,
      elevation: 8,
    },
    softCard: {
      color: '#0F172A',
      opacity: 0.1,
      radius: 14,
      offsetY: 6,
      elevation: 5,
    },
    primaryBtn: {
      color: '#4F6FFF',
      opacity: 0.35,
      radius: 12,
      offsetY: 8,
      elevation: 7,
    },
    softButton: {
      color: '#0F172A',
      opacity: 0.08,
      radius: 8,
      offsetY: 4,
      elevation: 2,
    },
  },
  white: '#FFFFFF',
  gray: '#F1F5F9',
  overlay: 'rgba(2,6,23,0.55)',
} as const;

export const radius = {
  xl: 32,
  lg: 18,
  md: 14,
  card: 18,
  chip: 16,
  image: 12,
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  safeBottom: 34,
} as const;
