<script lang="ts">
	import { onMount } from "svelte";

	export let images: string[] = [];
	export let slide: number = 0;

	let container: HTMLDivElement;

	function onScroll(e) {
		// Check the offset of every image and set the slide to the index of the image that is closest to the center of the container
		let offset = 0;
		let closest = 0;
		let closestOffset = Infinity;
		for (let i = 0; i < images.length; i++) {
			let image = container.querySelector(`img[src="${images[i]}"]`);
			if (image) {
				offset = Math.abs(image.offsetLeft - container.scrollLeft);
				if (offset < closestOffset) {
					closestOffset = offset;
					closest = i;
				}
			}
		}
		slide = closest;
	}

	onMount(() => {
		let image = container.querySelector(`img[src="${images[slide]}"]`);
		container.scrollTo({ left: image?.offsetLeft, behavior: "instant"})
	})
</script>

<div class="relative h-full">
	<div class="overflow-x-scroll flex flex-row snap-x snap-mandatory" bind:this={container} on:scroll={onScroll}>
		{#each images as link}
		<img
		src={link}
		class="snap-center object-contain mr-[100%]"
		alt="" />
		{/each}
		
	</div>
	<div class="absolute bottom-4 left-[50%] translate-x-[-50%] flex flex-row items-center gap-2 z-10">
		{#each images as image, i}
			<button class="rounded-full bg-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.8)] w-2.5 h-2.5" class:bg-white={slide === i} on:click={() => {
				slide = i;
				let image = container.querySelector(`img[src="${images[slide]}"]`);
				container.scrollTo({ left: image?.offsetLeft, behavior: "smooth"})
			}}></button>
		{/each}
	</div>
	
</div>

<style>
	/* Hide the scrollbar of the container element */
	::-webkit-scrollbar {
		display: none;
	}

	.bg-white {
		background: white;
	}
</style>