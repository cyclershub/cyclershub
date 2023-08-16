<script lang="ts">
	import { LeafletMap } from "../LeafletMap";
	import type { Place } from "./Place";
	import type { UserType } from "~/lib/User/types";
	import AddButton from "../AddButton.svelte";
	import Sidebar from "./Sidebar.svelte";
	import SearchOverlay from "./SearchOverlay.svelte";
  import { placesVisible } from "./shared";

	export let user: UserType;

	export let latitude: number;
	export let longitude: number;

	let history = new Map<string, Map<number, Place>>();
	let showCity: string = "";
	let saved = new Map<number, Place>();

	$: {
		if ($placesVisible.length > 0) {
			if (!history.has($placesVisible[0].city)) {
				history.set($placesVisible[0].city, new Map());
			}

			history.get($placesVisible[0].city)?.set($placesVisible[0].id, $placesVisible[0]);
			history = history;
		}
	}
</script>

<div class="grid grid-cols-[80px,1fr] w-full h-full">
	<Sidebar bind:history bind:showCity bind:saved />
	<LeafletMap radius={25000} />
</div>

<SearchOverlay
bind:saved
bind:showCity
bind:history />

{#if user}
	<AddButton href="/pedalpoint/add" />
{/if}
