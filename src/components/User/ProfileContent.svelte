<script lang="ts">
	import ArrowRight from "../Icons/ArrowRight.svelte";
import Overlay from "../Overlay.svelte";
	import Slideshow from "../ImageSlideshow.svelte";
	import type { User } from "~/lib/types";

	export let user: User;
	export let images: any[];

	let overlayVisible = false;
	let slide: number = 0;
</script>

<h1>Hey there, {user.username}!</h1>
<div class="flex justify-between items-center">
	<p>Here are your latest images:</p>
	<a href="/user/images"><ArrowRight width={25} height={25} class="fill-black-brown"></ArrowRight></a>
</div>
<div class="flex flex-row overflow-scroll scrollbar-hide gap-4">
	{#each images as image, i}
		<button on:click={() => {
			slide = i;
			overlayVisible = true
			}}><img src={`/api/image/${image.uid}.png`} class="max-w-[280px] h-auto object-cover rounded-xl"></button>
	{/each}
</div>
<div class="flex justify-between items-center">
	<p>And here are the routes you uploaded:</p>
	<a href="/user/routes"><ArrowRight width={25} height={25} class="fill-black-brown"></ArrowRight></a>
</div>
<div class="flex flex-row overflow-scroll scrollbar-hide gap-4">
	{#each images as image, i}
		<button on:click={() => {
			slide = i;
			overlayVisible = true
			}}><img src={`/api/route/${image.uid}.gpx`} class="max-w-[280px] h-auto object-cover rounded-xl"></button>
	{/each}
</div>

<Overlay bind:visible={overlayVisible}>
	<div class="w-full h-full flex items-center justify-center">
		<div class="w-2/4">
			<Slideshow images={images.map(image => `/api/image/${image.uid}.png`)} slide={slide}></Slideshow>
		</div>
	</div>
	
</Overlay>