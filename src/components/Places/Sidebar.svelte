<script lang="ts">
  import Bookmark from "../Icons/Bookmark.svelte";
	import type { Place } from "./Place";

	export let poi: Place;
	export let history: Map<string, Map<number, Place>>;
	export let activePanel: number | boolean;
	export let showCity: string;
	export let saved: Map<number, Place>;

	let placesArray: [string, Place[]][] = [];

	$: placesArray = Array.from(history).map(([city, places]) => {
		return [city, Array.from(places).map((x: [number, Place]) => x[1])];
	})
</script>

<div class="w-[80px] bg-white border-r flex flex-col items-center py-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
	<div class="flex flex-col items-center gap-2 cursor-pointer" on:click={() => {
		activePanel = 2;
	}}>
		<button class="relative" >
			<Bookmark width={20} height={20}></Bookmark>
			<span class="text-xs absolute top-3 right-[-8px] z-[100] text-black font-bold px-0.5">{Array.from(saved).length}</span>
		</button>
		<span class="text-xs break-all text-gray-400">Saved</span>
	</div>
	<hr class="border my-4 w-full mx-2">
	{#each placesArray as [city, places]}
		{#if places.length == 1}
		<div class="p-2 text-center flex flex-col items-center gap-2 cursor-pointer" on:click={() => {
			activePanel = 0;
			showCity = city
		}}>
			<img src={places[0].images[0]?.thumb || "/landscape-placeholder.svg"} class="rounded-lg object-cover w-[40px] h-[40px]" alt="">
			<span class="text-xs break-all text-gray-400">{places[0].city}</span>
		</div>
		{:else}
		<div class="p-2 text-center flex flex-col items-center gap-2 relative cursor-pointer" on:click={() => {
			activePanel = 0;
			showCity = city
		}}>
			<div class="relative">
				<img src={places[0].images[0]?.thumb || "/landscape-placeholder.svg"} class="border relative left-0 top-0 z-[10] rounded-lg object-cover w-[40px] h-[40px]" alt="">
			<img src={places[1].images[0]?.thumb || "/landscape-placeholder.svg"} class="border absolute left-1 top-1 rounded-lg object-cover w-[40px] h-[40px]" alt="">
			</div>
			<span class="text-xs absolute top-7 left-3 z-[100] text-white font-bold px-0.5">{places.length}</span>
			<span class="text-xs break-all text-gray-400">{places[0].city}</span>
		</div>
		{/if}
	{/each}
</div>