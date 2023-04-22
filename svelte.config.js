import { vitePreprocess } from "@astrojs/svelte";
import preprocess from "svelte-preprocess";

export default {
	preprocess: [vitePreprocess(), preprocess()],
};
