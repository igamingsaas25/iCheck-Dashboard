/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', /* slate-400 with opacity */
        input: 'var(--color-input)', /* slate-800 */
        ring: 'var(--color-ring)', /* blue-500 */
        background: 'var(--color-background)', /* slate-900 */
        foreground: 'var(--color-foreground)', /* slate-50 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* blue-500 */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* violet-500 */
          foreground: 'var(--color-secondary-foreground)', /* white */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-600 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* slate-700 */
          foreground: 'var(--color-muted-foreground)', /* slate-400 */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* emerald-500 */
          foreground: 'var(--color-accent-foreground)', /* white */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* slate-800 */
          foreground: 'var(--color-popover-foreground)', /* slate-50 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* slate-800 */
          foreground: 'var(--color-card-foreground)', /* slate-50 */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* emerald-600 */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-600 */
          foreground: 'var(--color-warning-foreground)', /* white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-600 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        /* Gaming Analytics Specific Colors */
        surface: {
          DEFAULT: 'var(--color-surface)', /* slate-800 */
          foreground: 'var(--color-surface-foreground)', /* slate-50 */
        },
        'text-primary': 'var(--color-text-primary)', /* slate-50 */
        'text-secondary': 'var(--color-text-secondary)', /* slate-400 */
        /* Alert Status Colors */
        critical: {
          DEFAULT: 'var(--color-critical)', /* red-600 */
          foreground: 'var(--color-critical-foreground)', /* white */
        },
        high: {
          DEFAULT: 'var(--color-high)', /* amber-600 */
          foreground: 'var(--color-high-foreground)', /* white */
        },
        medium: {
          DEFAULT: 'var(--color-medium)', /* blue-500 */
          foreground: 'var(--color-medium-foreground)', /* white */
        },
        low: {
          DEFAULT: 'var(--color-low)', /* emerald-500 */
          foreground: 'var(--color-low-foreground)', /* white */
        },
        /* Data Visualization Colors */
        chart: {
          1: 'var(--color-chart-1)', /* blue-500 */
          2: 'var(--color-chart-2)', /* violet-500 */
          3: 'var(--color-chart-3)', /* emerald-500 */
          4: 'var(--color-chart-4)', /* amber-500 */
          5: 'var(--color-chart-5)', /* red-500 */
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        data: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'data-xs': ['0.75rem', { lineHeight: '1rem', fontFamily: 'JetBrains Mono' }],
        'data-sm': ['0.875rem', { lineHeight: '1.25rem', fontFamily: 'JetBrains Mono' }],
        'data-base': ['1rem', { lineHeight: '1.5rem', fontFamily: 'JetBrains Mono' }],
        'data-lg': ['1.125rem', { lineHeight: '1.75rem', fontFamily: 'JetBrains Mono' }],
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'modal': 'var(--shadow-modal)',
        'elevated': 'var(--shadow-elevated)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'pulse-critical': 'pulse-critical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}