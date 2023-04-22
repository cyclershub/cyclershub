/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,scss,css}"],
	theme: {
		extend: {
			colors: {
				primary: "rgb(255, 125, 38)",
				secondary: "rgb(68, 79, 148)",
				"gray-primary": "rgb(146, 151, 153)",
				bg: "white",
				"status-error": "red",
				"status-success": "green",
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
