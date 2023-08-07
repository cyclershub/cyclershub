<script lang="ts">
	import { onMount } from "svelte";
	import ArrowLeft from "./Icons/ArrowLeft.svelte";
	import ArrowRight from "./Icons/ArrowRight.svelte";

	export let slide: number = 0;

	let container: HTMLDivElement;

	function onScroll(e: Event) {
		// Check the offset of every image and set the slide to the index of the image that is closest to the center of the container
		let offset = 0;
		let closest = 0;
		let closestOffset = Infinity;
		for (let i = 0; i < container.children.length; i++) {
			let child = container.children[i];
			if (child) {
				offset = Math.abs((child as HTMLElement).offsetLeft - container.scrollLeft);
				if (offset < closestOffset) {
					closestOffset = offset;
					closest = i;
				}
			}
		}
		slide = closest;
	}

	onMount(() => {
		let child = container.children[slide];

		if (!child) return;

		container.scrollTo({
			left: (child as HTMLElement).offsetLeft,
			behavior: "instant",
		});
	});

	$: {
		if (container) {
			let child = container.children[slide];

			if (child) {
				container.scrollTo({
					left: (child as HTMLElement).offsetLeft,
					behavior: "smooth",
				});
			}
		}
	}
</script>

<div class="relative h-full">
	<button
		class="absolute top-[50%] left-6 translate-y-[-50%] z-10 hover:left-4 transition-all">
		<ArrowLeft
			width={30}
			height={30}
			class="fill-white" />
	</button>
	<div
		class="overflow-x-scroll grid grid-flow-col snap-x snap-mandatory scrollbar-hide h-full"
		style="grid-auto-columns: 100%;"
		bind:this={container}
		on:scroll={onScroll}>
		<slot />
	</div>
	<button
		class="absolute top-[50%] right-6 translate-y-[-50%] z-10 hover:right-4 transition-all">
		<ArrowRight
			width={30}
			height={30}
			class="fill-white" />
	</button>
</div>
