export const theme = {
  colors: {
    primary: '#6366F1', // Indigo / CodeAlpha Brand
    primaryDark: '#4F46E5',
    primaryLight: '#EEF2FF',
    secondary: '#06B6D4', // Cyan accent
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    danger: '#EF4444', // Red
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    text: '#0F172A', // Slate 900
    textMuted: '#64748B', // Slate 500
    textLight: '#94A3B8', // Slate 400
    white: '#FFFFFF',
    dark: '#0F172A',
    
    // Task-specific accent colors
    task1: '#8B5CF6', // Purple - Flashcards
    task1Light: '#F5F3FF',
    task2: '#EC4899', // Pink/Rose - Quotes
    task2Light: '#FDF2F8',
    task3: '#10B981', // Emerald - Fitness
    task3Light: '#ECFDF5',
    task4: '#3B82F6', // Blue - Language
    task4Light: '#EFF6FF',
  },
  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 11,
      sm: 13,
      base: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
      title: 32,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '800',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    huge: 32,
  },
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
