/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		`./src/pages/**/*.{js,jsx,ts,tsx}`,
		`./src/components/**/*.{js,jsx,ts,tsx}`,
	],
	theme: {
		extend: {
			screens: {
				xs: '512px',
				short: { raw: '(min-height: 500px)' },
				average: { raw: '(min-height: 650px)' },
				tall: { raw: '(min-height: 800px)' },
			},
		},
	},
	plugins: [],
};
