/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export const content = [
	`./src/pages/**/*.{js,jsx,ts,tsx}`,
	`./src/components/**/*.{js,jsx,ts,t'sx}`,
];

export const theme = {
	extend: {
		fontFamily: {
			sans: ['"Retro"', ...defaultTheme.fontFamily.sans],
		},
		screens: {
			xs: '512px',
			short: { raw: '(min-height: 500px)' },
			average: { raw: '(min-height: 650px)' },
			tall: { raw: '(min-height: 800px)' },
		},
		colors: {
			'blue-accent': '#023788',
			'purple-accent': '#650d89',
			'burgundy-accent': '#920075',
			'pink-accent': '#f6019d',
			'yellow-accent': '#f9c80e',
			'black-primary': '#1f0728',
			'dark-primary': '#353c45',
			'light-primary': '#6e83a1',
			'white-primary': '#f5f9ff',
			'purple-watermark': '#291632',
		},
		transitionTimingFunction: {
			steps: 'steps(2, end)',
		},
	},
};

export const plugins = [];
