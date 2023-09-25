import i18n from "astro-i18n"
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
	compressHTML: true,
  integrations: [i18n(),svelte(), tailwind(), sitemap(), mdx(), compress({
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