<script lang="ts">
	import "leaflet-canvas-markers";
	import L, { LatLngExpression } from "leaflet";
	import type { Place } from "../Places";
	let map: L.Map;

	export let latitude: number;
	export let longitude: number;
	export let activePanel: number | boolean;

	let manuallyActivatedCurrentMarker: boolean = false;

	let initialView: LatLngExpression = [0, 0];
	// Get the current user location.

	function createMap(container: HTMLElement) {
		let map = L.map(container, { preferCanvas: true, maxZoom: 14, minZoom: 6, zoomControl: false }).setView(initialView, 12);
		L.control.zoom({
			position: "bottomright"
		}).addTo(map);
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
				subdomains: "abcd",
				maxZoom: 14,
			}
		).addTo(map);

		return map;
	}

	function createCanvasMarker(
		location: { lat: number; lng: number },
		type: string
	) {
		let marker = L.canvasMarker(
			{ lat: location.lat, lng: location.lng },
			{
				img: {
					url: `/icons/${type}.svg`,
					size: [28, 38],
					rotate: 0,
					offset: { x: 0, y: -19 },
				},
			}
		);

		return marker;
	}

	export let poi: Place | null;
	async function createMarker(location: Place): Promise<L.Marker<any>> {
		const marker = createCanvasMarker(
			{ lat: location.lat, lng: location.lng },
			location.type
		);

		let clickMarker = L.marker(
			{ lat: location.lat, lng: location.lng },
			{ opacity: 0, zIndexOffset: -1 }
		).addTo(map);

		clickMarker.on("mouseover", () => {
			if (marker.options.img) {
				marker.options.img.offset.y = -24;
			}
			map.removeLayer(marker);
			map.addLayer(marker);
		});

		clickMarker.on("mouseout", () => {
			if (marker.options.img) {
				marker.options.img.offset.y = -14;
			}
			map.removeLayer(marker);
			map.addLayer(marker);
			map.setView(map.getCenter());
		});

		clickMarker.on("click", () => {
			manuallyActivatedCurrentMarker = true;
			poi = location;
			latitude = location.lat;
			longitude = location.lng;
			activePanel = 1;
		});

		return marker;
	}

	const places = new Map<number, any>();

	function boundsToRadius(bounds: L.LatLngBounds, center: L.LatLng): number {
		const earthRadius = 6371; // in km
		const neLatRad = (Math.PI * bounds.getNorthEast().lat) / 180;
		const swLatRad = (Math.PI * bounds.getSouthWest().lat) / 180;

		const latDistance = Math.abs(neLatRad - swLatRad);
		const latRadius = (latDistance / 2) * earthRadius;

		const neLngRad = (Math.PI * bounds.getNorthEast().lng) / 180;
		const swLngRad = (Math.PI * bounds.getSouthWest().lng) / 180;

		const lngDistance = Math.abs(neLngRad - swLngRad);
		const lngRadius =
			((lngDistance > Math.PI ? 2 * Math.PI - lngDistance : lngDistance) / 2) *
			earthRadius;

		return Math.max(latRadius, lngRadius);
	}

	async function updateMarkers() {
		const center = map.getCenter();

		let radius = boundsToRadius(map.getBounds(), center);

		// Get places from park4night api.
		const response = await fetch(`/api/places`, {
			method: "POST",
			body: JSON.stringify({
				lat: center.lat,
				lng: center.lng,
				radius,
				limit: 250,
			}),
		});

		const json = await response.json();

		if (json.type == "success") {
			for (const place of json.data) {
				if (places.has(place.id)) {
					continue;
				}
				places.set(place.id, place);
				let marker = await createMarker(place);
				marker.addTo(map);
			}

			const focus = json.data.sort(
				(a: Place, b: Place) => a.distance - b.distance
			);

			if (focus.length > 0 && !manuallyActivatedCurrentMarker) {
				poi = focus[0];
			}
		}
	}

	function mapAction(container: HTMLElement) {
		map = createMap(container);
		map.on("dragend", updateMarkers);
		map.on("zoomend", updateMarkers);

		map.on("click", () => {
			manuallyActivatedCurrentMarker = false;
			poi = null;
			activePanel = false;
		});

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				if (!latitude) {
					latitude = position.coords.latitude;
				}

				if (!longitude) {
					longitude = position.coords.longitude;
				}

				map.setView([latitude, longitude], 14);

				let marker = createCanvasMarker(
					{ lat: latitude, lng: longitude },
					"LOC"
				);
				marker.addTo(map);
				updateMarkers();
			});
		}

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
		if (map) {
			map.setView({ lat: latitude, lng: longitude }, 14);
			updateMarkers();
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