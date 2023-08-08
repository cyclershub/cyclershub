import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	experimental: {
		assets: true
	},
  integrations: [svelte(), tailwind(), sitemap()],
	site: "https://cyclershub.com",
  output: "server",
  adapter: node({
    mode: "middleware"
  })
});