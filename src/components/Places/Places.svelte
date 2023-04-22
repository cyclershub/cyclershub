<script lang="ts">
  import moment from "moment";
  import { LeafletMap } from "../LeafletMap";
  import type { Place } from "./Place";
  import type { UserType } from "~/lib/User/types";
  import Gallery from "../Gallery.svelte";

	export let user: UserType;

	export let latitude: number;
	export let longitude: number;

	let currentlyVisibleMarker: Place;
	let searchQuery: string = "";

	async function searchPlaceFromQuery() {
		const response = await fetch(`/api/geocode?query=${searchQuery}`, {
			method: "GET"
		});
		const json = await response.json();

		if (json.type == "success") {
			latitude = json.data.latitude;
			longitude = json.data.longitude

			searchQuery = json.data.formattedAddress
		}
	}

	let showImageGallery: boolean = false;
</script>

<div class="border-r w-full shadow-sm absolute bottom-0 left-0 z-[1000000000] bg-white lg:relative max-h-[40%] lg:max-h-[100%] overflow-auto">
	<input type="text" placeholder="Search..." class="absolute top-4 left-4 w-[calc(100%-32px)] shadow-sm" bind:value={searchQuery} on:keydown={(e) => {
		if (e.key == "Enter") {
			e.preventDefault();
			searchPlaceFromQuery();
		}
	}}>

	{#if currentlyVisibleMarker}
		{#if currentlyVisibleMarker.images && (currentlyVisibleMarker.images.length > 0)}
			<img src={currentlyVisibleMarker.images[0].thumb} alt="" class="cursor-pointer" on:click={() => showImageGallery = true}>
		{/if}
		<div class="px-4 py-2" class:mt-12={!currentlyVisibleMarker.images || currentlyVisibleMarker.images.length == 0}>
			<span class="text-gray-400">{moment(currentlyVisibleMarker.CreatedOn).format("MM.DD.YYYY")}</span>
			<h1 class="break-words">{currentlyVisibleMarker.title}</h1>
			<span class="text-gray-400">Rating: {currentlyVisibleMarker.rating}</span>
			<p class="break-words">{currentlyVisibleMarker.description}</p>
			<strong>{currentlyVisibleMarker.street}, {currentlyVisibleMarker.zipcode} {currentlyVisibleMarker.city} - {currentlyVisibleMarker.country}</strong>
			<a href="https://maps.google.com/?q={latitude},{longitude}" target="_blank" class="button flex items-center gap-2 w-fit"><img src="/icons/maps.svg" alt="Google Maps" width="25" class="inline"> Open With</a>
		</div>
	{/if}

	{#if showImageGallery}
		<div class="fixed z-[100] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[60%] h-auto max-h-[80%]">
			<Gallery images={currentlyVisibleMarker.images.map(x => x.url)}></Gallery>
		</div>
		<div class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] cursor-pointer" on:click={() => showImageGallery = false}></div>
	{/if}
</div>
<LeafletMap bind:currentlyVisibleMarker bind:latitude bind:longitude></LeafletMap>

{#if user}
	<a class="fixed z-[100000] bottom-8 right-8 rounded-full bg-blue-700 p-4 hover:bg-blue-900" href="/places/add">
		<svg width="15" height="15" viewBox="0 0 15 15" class="fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
	</a>
{/if}