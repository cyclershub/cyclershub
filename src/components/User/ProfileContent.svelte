<script lang="ts">
	import ArrowRight from "../Icons/ArrowRight.svelte";
import Overlay from "../Overlay.svelte";
	import Slideshow from "../ImageSlideshow.svelte";
	import type { User } from "~/lib/types";
	import Preview from "../Gallery/Preview.svelte";

	export let user: User;
	export let images: any[];
	export let stories: any[];

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
			}}><img src={`/api/image/${image.uid}.png`} class="max-w-[280px] h-auto object-cover rounded-sm"></button>
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
			}}><img src={`/api/route/${image.uid}.gpx`} class="max-w-[280px] h-auto object-cover rounded-sm"></button>
	{/each}
</div>
<div class="flex justify-between items-center">
	<p>And all the stories you've written:</p>
	<a href="/user/stories"><ArrowRight width={25} height={25} class="fill-black-brown"></ArrowRight></a>
</div>
<div class="flex flex-row overflow-scroll scrollbar-hide gap-4">
	{#each stories as story, i}
		<Preview entry={{
			author: user.username,
			title: story.title,
			uid: story.uid,
			category: story.category,
			tags: story.tags,
			cover: story.cover,
		}} href="/editor?uid={story.uid}"></Preview>
	{/each}
</div>

<Overlay bind:visible={overlayVisible}>
	<div class="w-full h-full flex items-center justify-center">
		<div class="w-2/4">
			<Slideshow images={images.map(image => `/api/image/${image.uid}.png`)} slide={slide}></Slideshow>
		</div>
	</div>
	
</Overlay>