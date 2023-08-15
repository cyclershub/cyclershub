<script lang="ts">
	import L from "leaflet";

	export let gpx: string;

	function createMap(container: HTMLElement) {
		var map = L.map(container, {
			center: [51.505, -0.09],
			zoom: 13,
		});
		L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
		}).addTo(map);
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin="" />
</svelte:head>

<div
	use:createMap
	class="w-[100%] h-[100%]" />

<style>
	:global(.leaflet-pane) {
		z-index: 5 !important;
	}
</style>