<script lang="ts">
  import moment from "moment";
  import { LeafletMap } from "../LeafletMap";
  import type { Place } from "./Place";
  import type { UserType } from "~/lib/User/types";

	export let user: UserType;

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

	let latitude = 0;
	let longitude = 0;
</script>

<div class="border-r w-full shadow-sm absolute bottom-0 left-0 z-[1000000000] bg-white px-4 py-2 lg:relative">
	<input type="text" placeholder="Search..." class="absolute top-2 left-4 w-[calc(100%-32px)] shadow-sm" bind:value={searchQuery} on:keydown={(e) => {
		if (e.key == "Enter") {
			e.preventDefault();
			searchPlaceFromQuery();
		}
	}}>

	{#if currentlyVisibleMarker}
		{#if currentlyVisibleMarker.images && currentlyVisibleMarker.images.length > 0}
			<img src={currentlyVisibleMarker.images[0]?.url} alt="">
		{/if}
		<div class="p-2" class:mt-12={!currentlyVisibleMarker.images}>
			<span class="text-gray-400">{moment(currentlyVisibleMarker.CreatedOn).format("MM.DD.YYYY")}</span>
			<h1 class="break-words">{currentlyVisibleMarker.title}</h1>
			<span class="text-gray-400">Rating: {currentlyVisibleMarker.rating}</span>
			<p class="break-words">{currentlyVisibleMarker.description}</p>
			<strong>{currentlyVisibleMarker.street}, {currentlyVisibleMarker.zipcode} {currentlyVisibleMarker.city} - {currentlyVisibleMarker.country}</strong>
		</div>
	{/if}
</div>
<LeafletMap bind:currentlyVisibleMarker {latitude} {longitude}></LeafletMap>

{#if user}
	<a class="fixed z-[10000] bottom-8 right-8 rounded-full bg-blue-700 p-4 hover:bg-blue-900" href="/places/add">
		<svg width="15" height="15" viewBox="0 0 15 15" class="fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
	</a>
{/if}