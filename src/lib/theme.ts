export const theme = {
  colors: {
    light: {
      background: '#FBF8F3',
      surface: '#F5F1E8',
      foreground: '#1A1A1A',
      accent: '#0066CC',
      accentHover: '#0052A3',
      border: '#E0D8C8',
      muted: '#6B6B6B',
      codeBg: '#FEFDFB',
      codeBorder: '#E8E3D8',
    },
    dark: {
      background: '#0A0A0A',
      surface: '#1A1A1A',
      foreground: '#E5E5E5',
      accent: '#60A5FA',
      accentHover: '#3B82F6',
      border: '#2A2A2A',
      muted: '#9CA3AF',
      codeBg: '#111111',
      codeBorder: '#252525',
    },
  },
  breakpoints: {
    mobile: '320px',
    tablet: '641px',
    desktop: '1025px',
  },
  transitions: {
    default: '300ms ease',
  },
  fonts: {
    sans: 'var(--font-geist-sans), Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'var(--font-geist-mono), "JetBrains Mono", "Fira Code", monospace',
  },
} as const;

export type Theme = typeof theme;
export type ThemeMode = 'light' | 'dark';
