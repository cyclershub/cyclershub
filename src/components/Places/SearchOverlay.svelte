<script lang="ts">
	import moment from "moment";
	import Gallery from "../Gallery.svelte";
	import type { Place } from "./Place";
	import { Panel, Panels } from "../Panels";
	import Bookmark from "../Icons/Bookmark.svelte";
	import Share from "../Icons/Share.svelte";

	export let poi: Place;
	export let latitude: number;
	export let longitude: number;
	export let history: Map<string, Map<number, Place>>;
	export let activePanel: number | boolean;
	export let showCity: string;
	export let saved: Map<number, Place>;

	let showImageGallery: boolean = false;
	let searchQuery: string = "";

	async function searchPlaceFromQuery() {
		const response = await fetch(`/api/geocode?query=${searchQuery}`, {
			method: "GET",
		});
		const json = await response.json();

		if (json.type == "success") {
			latitude = json.data.latitude;
			longitude = json.data.longitude;

			searchQuery = json.data.formattedAddress;
		}
	}

	let historyPlaces: Place[] = [];

	$: {
		if (showCity && history.has(showCity)) {
			historyPlaces = Array.from(
				history.get(showCity) as Map<number, Place>
			).map((x) => x[1]);
		}
	}
</script>

<input
	type="text"
	placeholder="Search..."
	class="z-[2000] absolute top-4 left-24 w-[368px] shadow-sm"
	bind:value={searchQuery}
	on:keydown={(e) => {
		if (e.key == "Enter") {
			e.preventDefault();
			searchPlaceFromQuery();
		}
	}} />

<div
	class="absolute left-20 top-0 z-[1000] w-[400px] h-[100vh] overflow-auto"
	class:border-l={activePanel !== false}
	class:hidden={activePanel === false}
	class:bg-white={activePanel !== false}>
	<Panels bind:activePanel>
		<Panel>
			<hr class="mt-20" />
			{#each historyPlaces as place}
				<div
					class="flex flex-row gap-4 mx-4 my-4 items-center hover:bg-gray-100 rounded-lg p-2 cursor-pointer select-none"
					on:click={() => {
						poi = place;
						latitude = poi.lat;
						longitude = poi.lng;
						activePanel = 1;
					}}>
					<img
						src={place.images[0]?.thumb || "/landscape-placeholder.svg"}
						alt=""
						class="w-[60px] rounded-lg h-full object-cover" />
					<div>
						<h3 class="font-semibold">
							{place.street}
							{place.zip}
							{place.city}
						</h3>
						<span>{place.description.substring(0, 40)}...</span>
					</div>
				</div>
			{/each}
		</Panel>
		<Panel>
			<div
				class="h-[250px] group relative cursor-pointer"
				on:click={() => (showImageGallery = true)}>
				<img
					src={poi.images[0]?.thumb || "/landscape-placeholder.svg"}
					alt=""
					class="object-cover h-[250px] w-full" />
				<span
					class="rounded-lg px-2 py-1 text-white bg-[rgba(0,0,0,0.6)] absolute left-2 bottom-2 invisible group-hover:visible">
					{poi.images.length}
					{poi.images.length == 1 ? "photo" : "photos"}
				</span>
			</div>
			<div class="px-4 py-2 mt-2">
				<span class="text-gray-400">
					{moment(poi.created_on).format("MMM DD, YYYY")}
				</span>
				<h1 class="break-words">{poi.title}</h1>
				<hr />
				<div class="flex flex-row gap-8 py-4 items-center">
					<a
						href="https://maps.google.com/?q={latitude},{longitude}"
						rel="noreferrer"
						target="_blank"
						class="flex flex-col items-center gap-2 w-fit">
						<img
							src="/icons/maps.svg"
							alt="Google Maps"
							class="bg-blue-500 p-2 w-10 h-10 rounded-full" />
						<span class="text-blue-700 text-sm">Maps</span>
					</a>
					<button
						on:click={() => {
							saved.set(poi.id, poi);
							localStorage.setItem("saved", JSON.stringify(Array.from(saved)));
							saved = saved;
						}}
						class="flex flex-col items-center gap-2 w-fit">
						<Bookmark
							width={15}
							height={15}
							class="bg-blue-500 p-2 w-10 h-10 rounded-full fill-white" />
						<span class="text-blue-700 text-sm">Bookmark</span>
					</button>
					<button
						on:click={() => {}}
						class="flex flex-col items-center gap-2 w-fit">
						<Share
							width={15}
							height={15}
							class="bg-blue-500 p-2 w-10 h-10 rounded-full fill-white" />
						<span class="text-blue-700 text-sm">Share</span>
					</button>
				</div>
				<hr />
				<span class="text-gray-400">Rating: {poi.rating}</span>
				<p class="break-words">{poi.description}</p>
				<strong>{poi.street} {poi.zip} {poi.city}</strong>
			</div>
		</Panel>
		<Panel>
			<hr class="mt-20" />
			{#each Array.from(saved) as [id, place]}
				<div
					class="flex flex-row gap-4 mx-4 my-4 items-center hover:bg-gray-100 rounded-lg p-2 cursor-pointer select-none"
					on:click={() => {
						poi = place;
						latitude = poi.lat;
						longitude = poi.lng;
						activePanel = 1;
					}}>
					<img
						src={place.images[0]?.thumb || "/landscape-placeholder.svg"}
						alt=""
						class="w-[60px] rounded-lg h-full object-cover" />
					<div>
						<h3 class="font-semibold">
							{place.street}
							{place.zip}
							{place.city}
						</h3>
						<span>{place.description.substring(0, 40)}...</span>
					</div>
				</div>
			{/each}
		</Panel>
	</Panels>

	{#if showImageGallery}
		<div
			class="fixed z-[10000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[60%] h-auto max-h-[80%]">
			<Gallery images={poi.images.map((x) => x.url)} />
		</div>
		<div
			class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] cursor-pointer"
			on:click={() => (showImageGallery = false)} />
	{/if}
</div>
