/**
 * Tailwind CSS runtime configuration (CDN build)
 * Northfield Medical Center design tokens
 */
tailwind.config = {
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff', 100: '#e0effe', 200: '#b9dffd', 300: '#7cc5fc',
          400: '#36a8f8', 500: '#0c8de9', 600: '#006fc7', 700: '#0159a1',
          800: '#064c85', 900: '#0b406e', 950: '#072849',
        },
        mint: {
          50: '#effefa', 100: '#c8fff1', 200: '#91fee4', 300: '#52f5d3',
          400: '#1ee1bf', 500: '#06c5a6', 600: '#019f88', 700: '#067f6f',
          800: '#0a655a', 900: '#0d534b', 950: '#00332f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 40px -16px rgba(7, 40, 73, 0.18)',
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -8px rgba(16, 24, 40, 0.08)',
      },
    },
  },
};
