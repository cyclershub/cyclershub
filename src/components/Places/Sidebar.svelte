<script lang="ts">
  import Bookmark from "../Icons/Bookmark.svelte";
	import type { Place } from "./Place";
  import { placesVisible, showMultiplePlaces, showSinglePlace } from "./shared";

	export let history: Map<string, Map<number, Place>>;
	export let showCity: string;
	export let saved: Map<number, Place>;

	let placesArray: [string, Place[]][] = [];

	$: placesArray = Array.from(history).map(([city, places]) => {
		return [city, Array.from(places).map((x: [number, Place]) => x[1])];
	})
</script>

<div class="w-[80px] bg-white border-r flex flex-col items-center py-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
	<button class="flex flex-col items-center gap-2 cursor-pointer" on:click={() => {
		showMultiplePlaces(Array.from(saved).map(x => x[1]));
	}}>
		<div class="relative" >
			<Bookmark width={20} height={20}></Bookmark>
			<span class="text-xs absolute top-3 right-[-8px] z-[100] text-black font-bold px-0.5">{Array.from(saved).length}</span>
		</div>
		<span class="text-xs break-all text-gray-400">Saved</span>
	</button>
	<hr class="border my-4 w-full mx-2">
	{#each placesArray as [city, places]}
		{#if places.length == 1}
		<button class="p-2 text-center flex flex-col items-center gap-2 cursor-pointer" on:click={() => {
			showSinglePlace(places[0])
			showCity = city
		}}>
			<img src={places[0].images[0]?.thumb || "/landscape-placeholder.svg"} class="rounded-lg object-cover w-[40px] h-[40px] border-2" class:highlight={$placesVisible[0] && $placesVisible[0].city == city} alt="">
			<span class="text-xs break-all text-gray-400" class:highlight={$placesVisible[0] && $placesVisible[0].city == city}>{places[0].city}</span>
		</button>
		{:else}
		<button class="p-2 text-center flex flex-col items-center gap-2 relative cursor-pointer" on:click={() => {
			showMultiplePlaces(places);
			showCity = city
		}}>
			<div class="relative">
				<img src={places[0].images[0]?.thumb || "/landscape-placeholder.svg"} class="border relative left-0 top-0 z-[10] rounded-lg object-cover w-[40px] h-[40px]" alt="" class:highlight={$placesVisible[0] && $placesVisible[0].city == city}>
				<img src={places[1].images[0]?.thumb || "/landscape-placeholder.svg"} class="border absolute left-1 top-1 rounded-lg object-cover w-[40px] h-[40px]" alt="">
			</div>
			<span class="text-xs absolute top-7 left-3 z-[100] text-white font-bold px-0.5">{places.length}</span>
			<span class="text-xs break-all text-gray-400" class:highlight={$placesVisible[0] && $placesVisible[0].city == city}>{places[0].city}</span>
		</button>
		{/if}
	{/each}
</div>


<style>
	span.highlight {
		@apply text-blue-500;
	}

	img.highlight {
		@apply border-2 border-blue-500;
	}
</style>