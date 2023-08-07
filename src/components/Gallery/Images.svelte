<script lang="ts">
	import Overlay from "../Overlay.svelte";
	import Slideshow from "../ImageSlideshow.svelte";

	let visible: boolean = false;
	export let images: string[] = [];
</script>

<div class="flex flex-row gap-8">
	<div class="w-2/4">
		<img
			on:click={() => {
				visible = true;
			}}
			on:keydown={() => {
				visible = true;
			}}
			src={images[0]}
			alt="" />
	</div>
	<div class="grid grid-cols-2 gap-8 w-2/4">
		{#each images.slice(1, 5) as link}
			<img
				on:click={() => {
					visible = true;
				}}
				on:keydown={() => {
					visible = true;
				}}
				src={link}
				alt="" />
		{/each}
	</div>
</div>
<Overlay bind:visible>
	<div class="w-full h-full flex items-center justify-center">
		<div class="w-2/4">
			<Slideshow {images} />
		</div>
	</div>
</Overlay>

<style>
	img {
		@apply object-cover block h-full w-full rounded-xl cursor-pointer;
	}

	img:hover {
		@apply opacity-80;
	}
</style>
