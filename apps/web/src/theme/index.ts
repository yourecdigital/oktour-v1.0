import { createGlobalStyle } from 'styled-components';
import { isRTL, getLanguageDirection } from '../i18n';

// Theme interface
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyRTL: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndex: {
    dropdown: number;
    modal: number;
    tooltip: number;
    toast: number;
  };
  direction: 'ltr' | 'rtl';
}

// Base theme
export const baseTheme: Theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyRTL: '"Noto Sans Arabic", "Noto Sans Hebrew", "Inter", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1100,
    toast: 1200,
  },
  direction: 'ltr',
};

// RTL-aware theme creator
export const createTheme = (language: string): Theme => {
  const direction = getLanguageDirection(language);
  const isRTLMode = isRTL(language);
  
  return {
    ...baseTheme,
    direction,
    typography: {
      ...baseTheme.typography,
      fontFamily: isRTLMode ? baseTheme.typography.fontFamilyRTL : baseTheme.typography.fontFamily,
    },
  };
};

// Global styles with RTL support
export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    direction: ${({ theme }) => theme.direction};
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* RTL-specific styles */
  [dir="rtl"] {
    text-align: right;
  }

  [dir="ltr"] {
    text-align: left;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  /* Responsive typography */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }

  /* Print styles */
  @media print {
    * {
      color: black !important;
      background: white !important;
    }
  }
`;

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${baseTheme.breakpoints.mobile})`,
  tablet: `@media (min-width: ${baseTheme.breakpoints.tablet}) and (max-width: ${baseTheme.breakpoints.desktop})`,
  desktop: `@media (min-width: ${baseTheme.breakpoints.desktop})`,
  wide: `@media (min-width: ${baseTheme.breakpoints.wide})`,
};

// RTL-aware spacing helpers
export const getSpacing = (theme: Theme, direction: 'margin' | 'padding', side: 'start' | 'end' | 'top' | 'bottom', value: string) => {
  const isRTL = theme.direction === 'rtl';
  const property = isRTL && side === 'start' ? 'right' : 
                  isRTL && side === 'end' ? 'left' : 
                  side === 'start' ? 'left' : 
                  side === 'end' ? 'right' : side;
  
  return `${direction}-${property}: ${value}`;
};

