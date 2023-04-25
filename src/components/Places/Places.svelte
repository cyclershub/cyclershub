<script lang="ts">
	import { LeafletMap } from "../LeafletMap";
	import type { Place } from "./Place";
	import type { UserType } from "~/lib/User/types";
	import AddButton from "../AddButton.svelte";
	import Sidebar from "./Sidebar.svelte";
	import SearchOverlay from "./SearchOverlay.svelte";

	export let user: UserType;

	export let latitude: number;
	export let longitude: number;

	let history = new Map<string, Map<number, Place>>();
	let activePanel: number = 0;
	let showCity: string = "";

	$: {
		if (poi) {
			if (!history.has(poi.city)) {
				history.set(poi.city, new Map());
			}

			history.get(poi.city)?.set(poi.id, poi);
			history = history;
		}
	}

	let poi: Place;
</script>

<div class="grid grid-cols-[80px,1fr] w-full h-full">
	<Sidebar bind:poi bind:history bind:activePanel bind:showCity />
	<LeafletMap
		bind:poi
		bind:activePanel
		bind:latitude
		bind:longitude />
</div>

<SearchOverlay
bind:poi
bind:showCity
bind:longitude
bind:activePanel
bind:latitude
bind:history />

{#if user}
	<AddButton href="/places/add" />
{/if}
