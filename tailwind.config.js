/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export const content = [
	`./src/pages/**/*.{js,jsx,ts,tsx}`,
	`./src/components/**/*.{js,jsx,ts,t'sx}`,
];

export const theme = {
	extend: {
		keyframes: {
			pan: {
				from: { transform: 'translateX(-100%)' },
				to: { transform: 'translateX(100%)' },
			},
			'pan-vertical': {
				from: { transform: 'translateY(-100%)' },
				to: { transform: 'translateY(100%)' },
			},
			blink: {
				to: { visibility: 'hidden' },
			},
		},
		animation: {
			pan: 'pan linear infinite',
			'pan-vertical': 'pan-vertical linear infinite',
			blink: 'blink 1s steps(5, start) infinite',
		},
		fontFamily: {
			sans: ['"Retro"', ...defaultTheme.fontFamily.sans],
			display: ['"Retro Fancy"', ...defaultTheme.fontFamily.serif],
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
		backgroundSize: {
			double: '200%',
		},
	},
};

export const plugins = [];
