/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			colors: {
				"black-brown": "#1f0500",
				"beaver-gray": "#59564c",
				"light-driftwood": "#c5b7ad",
				"dark-red-copper": "#6c2411",
				"light-copper": "#be673a",
				"light-golden-brown": "#d69254",
			},
		},
		
	},
	darkMode: "class",
	plugins: [],
};
