import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true
  },
  integrations: [svelte(), tailwind(), sitemap(), mdx()],
  site: "https://cyclershub.com",
  output: "server",
  adapter: node({
    mode: "middleware"
  })
});