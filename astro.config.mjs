import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true
  },
  integrations: [svelte(), tailwind(), sitemap(), mdx(), compress({
		Image: {
			jpeg: {
				quality: 80,
			}
		}
	})],
  site: "https://cyclershub.com",
  output: "server",
  adapter: node({
    mode: "middleware"
  })
});