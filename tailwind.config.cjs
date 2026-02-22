const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		screens: {
			xs: '480px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		colors: {
			black: '#000',
			white: '#fff',
			ink: '#1f1f26',
			'ink-soft': '#5f5f6b',
			cream: '#f8f7f5',
			'cream-2': '#eef1f7',
			orange: '#ff8a3d',
			'orange-soft': '#ffe6d5',
			'status-sky': '#74b8ff',
			'status-green': '#6fd39b',
			'status-orange': '#ff9a56',
			'status-red': '#ff6b6b',
			shadow: 'rgba(31, 31, 38, 0.12)',
		},
		fontFamily: {
			// Headings
			sans: ['"M PLUS Rounded 1c"', 'sans-serif'],
			// Base text
			monospace: ['"JetBrains Mono"', 'monospace'],
		},
		fontSize: {
			xs: '.75rem',
			sm: '.875rem',
			tiny: '.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
		},
		letterSpacing: {
			wide: '.025em',
		},
	},
	plugins: [
		plugin(function ({ addBase, theme }) {
			addBase({
				h2: {
					letterSpacing: theme('letterSpacing.wide'),
					fontWeight: 'bold',
				},
				li: {
					letterSpacing: theme('letterSpacing.wide'),
				},
			});
		}),
	],
};
