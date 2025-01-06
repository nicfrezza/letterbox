module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Certifique-se disso
  theme: {
    extend: {},
  },
  plugins: [],
};



module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'bounce-slow': 'bounce-slow 2s infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [],
}