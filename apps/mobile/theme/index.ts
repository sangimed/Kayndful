export type Gradient = readonly [string, string];

export const colors = {
  // Brand and base palette
  brand: {
    iconGradient: ['#FFD9BE', '#F7BFC0'] as const,
    primaryGradient: ['#FFC7A0', '#F793B0'] as const,
    primary: '#F67C8B',
    accent: '#F4A261',
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    surfaceStrong: '#F1F5F9',
  },
  // Semantic status colors
  semantic: {
    success: '#16a34a',
    danger: '#dc2626',
    successGradient: ['#BBF7D0', '#22C55E'] as const,
    dangerGradient: ['#FECACA', '#EF4444'] as const,
    neutral: '#0f172a',
  },
  // App level surfaces (light/dark aware usage in components)
  app: {
    backgroundLight: '#F7F8FA',
    backgroundDark: '#0E1114',
    cardLight: '#FFFFFF',
    cardDark: '#151A1E',
    // Subtle surface tint used for gradients/overlays
    tintLight: 'rgba(0,0,0,0.04)',
    tintDark: 'rgba(255,255,255,0.06)',
  },
  // Shadow presets for soft, diffuse elevation
  shadow: {
    brand: {
      color: '#000',
      opacity: 0.2,
      radius: 16,
      offsetY: 12,
      elevation: 12,
    },
    softCard: {
      color: '#000',
      opacity: 0.12,
      radius: 18,
      offsetY: 8,
      elevation: 6,
    },
    primaryBtn: {
      color: '#F97316',
      opacity: 0.3,
      radius: 12,
      offsetY: 10,
      elevation: 8,
    },
    softButton: {
      color: '#0F172A',
      opacity: 0.1,
      radius: 10,
      offsetY: 6,
      elevation: 3,
    },
  },
  white: '#FFFFFF',
  gray: '#F3F4F6',
  overlay: 'rgba(15,23,42,0.55)',
} as const;

export const radius = {
  // Global sizes
  xl: 36,
  lg: 20,
  md: 15,
  // Component-specific presets
  card: 16,
  chip: 18,
  image: 12,
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
} as const;
