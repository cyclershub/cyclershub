<script lang="ts">
	import SvelteMarkdown from "svelte-markdown";
	import Paragraph from "./Paragraph.svelte";
	import Overlay from "../Overlay.svelte";
	import Slideshow from "../Slideshow.svelte";
	import Slide from "../Slide.svelte";
	export let content: string;

	let images: string[] = [];

	// Recursively find all images in the markdown
	function recursiveTagFinder(tag: string, tokens: any[]) {
		let elements: any[] = [];

		function recursiveFinder(t: any[]) {
			for (const token of t) {
				if (token.type == tag) {
					elements.push(token);
				}

				if (token.tokens) {
					recursiveFinder(token.tokens);
				}
			}
		}

		recursiveFinder(tokens);

		return elements;
	}

	let overlayVisible = false;
	let activeSlide = 0;
</script>

<SvelteMarkdown
	source={content}
	on:parsed={(ev) => {
		images = recursiveTagFinder("image", ev.detail.tokens).map((token) => {
			return token.href;
		});
	}} />

<svelte:body
	on:click={(e) => {
		if (e.target instanceof HTMLImageElement) {
			overlayVisible = true;
			activeSlide = images.indexOf(e.target.src);
		}
	}} />

<Overlay bind:visible={overlayVisible}>
	<Slideshow bind:slide={activeSlide}>
		{#each images as image}
			<Slide>
				<div class="flex items-center justify-center w-full h-full">
					<img
						src={image}
						alt=""
						class="max-w-[80vw] max-h-[80vh]" />
				</div>
			</Slide>
		{/each}
	</Slideshow>
</Overlay>
