<script lang="ts">
	import "leaflet-canvas-markers";
	import L, { MarkerCluster } from "leaflet";
  import { hideAllPlaces, latitude, longitude, placesVisible, showSinglePlace } from "../Places/shared";
	import { onMount } from "svelte";
	import { decodeStream } from "./decodeStream";
	let map: L.Map;

	const placeLayer = L.canvas({
		padding: 0.5
	});

	function createMap(container: HTMLElement) {
		let map = L.map(container, { preferCanvas: true, maxZoom: 18, minZoom: 6, zoomControl: false });
		L.control.zoom({
			position: "bottomleft"
		}).addTo(map);
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}@2r.png",
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
				subdomains: "abcd",
				maxZoom: 18,
			}
		).addTo(map);
		map.setView([0, 0], 6);

		return map;
	}

	export let limit = 250000;
	export let radius = 500;

	async function streamPlaces() {
		const allPlaces = await fetch("/api/places.stream", {
			method: "POST",
			body: JSON.stringify({
				limit,
				lat: $latitude,
				lng: $longitude,
				radius
			})
		}).then(res => res.json())

		const stream = atob(allPlaces.data)
		const decodedPlaces = decodeStream(stream);
		
		for (const place of decodedPlaces) {
				if (places.has(place.id) || place.id === $placesVisible[0]?.id) {
					continue;
				}
				places.set(place.id, place);
				
				createMarker(place);
			}
	}

	onMount(async () => {
		// Try to get the current location.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				if (!$latitude) {
					latitude.set(position.coords.latitude);
				}

				if (!$longitude) {
					longitude.set(position.coords.longitude);
				}

				map.setView([$latitude, $longitude], 12);
				await streamPlaces();

				//const location = placeLayer.addCustomIcon("LOC", L.latLng($latitude, $longitude));
			});
		} else {
			await streamPlaces();
		}

		
	})

	async function createMarker(location: { lat: number, lng: number, id: number }): Promise<L.CircleMarker> {
		const marker = L.circleMarker([location.lat, location.lng], {renderer: placeLayer, radius: 8, bubblingMouseEvents: true }).addTo(map);

		marker.on("click", async () => {
			latitude.set(location.lat)
			longitude.set(location.lng);

			const place = await fetch(`/api/place.json?id=${location.id}`, {
				method: "GET"
			}).then(res => res.json())

			showSinglePlace(place.data)
		});

		return marker;
	}

	const places = new Map<number, any>();

	function mapAction(container: HTMLElement) {
		map = createMap(container);
		map.on("click", () => {
			hideAllPlaces();
		});

		map.on("moveend", () => {
			latitude.set(map.getCenter().lat);
			longitude.set(map.getCenter().lng);
		})

		placeLayer.addTo(map);

		return {
			destroy: () => {
				map.remove();
			},
		};
	}

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}

	$: {
		if (map && $latitude && $longitude) {
			map.setView([$latitude, $longitude], map.getZoom())
		}
	}
</script>

<svelte:window on:resize={resizeMap} />

	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin="" />
	<div
		class="map w-full h-full"
		use:mapAction />