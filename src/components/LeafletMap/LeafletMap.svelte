<script lang="ts">
	import "leaflet-canvas-markers";
	import L from "leaflet";
	import { IconCanvasLayer } from "./IconCanvasLayer";
	import type { Place } from "../Places";
  import { hideAllPlaces, latitude, longitude, placesVisible, showSinglePlace } from "../Places/shared";
	let map: L.Map;

	let manuallyActivatedCurrentMarker: boolean = false;

	const placeLayer = new IconCanvasLayer({
		sparse: 1/14
	});

	function createMap(container: HTMLElement) {
		let map = L.map(container, { preferCanvas: true, maxZoom: 18, minZoom: 6, zoomControl: false });
		L.control.zoom({
			position: "bottomright"
		}).addTo(map);
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}@2r.png",
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
				subdomains: "abcd",
				maxZoom: 18,
			}
		).addTo(map);

		return map;
	}

	async function createMarker(location: Place): Promise<Symbol> {
		if (location.marker) {
			placeLayer.removePlace(location.marker);
		}

		const marker = await placeLayer.addPlace(location);

		location.marker = marker;

		let clickMarker = L.marker(
			{ lat: location.lat, lng: location.lng },
			{ opacity: 0, zIndexOffset: -1 }
		).addTo(map);

		clickMarker.on("mouseover", () => {
			// TODO: zoom The image bigger or something.
		});

		clickMarker.on("mouseout", () => {
			// TODO: zoom The image smaller or something.
			map.setView(map.getCenter());
		});

		clickMarker.on("click", () => {
			manuallyActivatedCurrentMarker = true;
			latitude.set(location.lat)
			longitude.set(location.lng);
			showSinglePlace(location)
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
				if (places.has(place.id) || place.id === $placesVisible[0]?.id) {
					continue;
				}
				places.set(place.id, place);
				await createMarker(place);
			}

			const focus = json.data.sort(
				(a: Place, b: Place) => a.distance - b.distance
			);

			if (focus.length > 0 && !manuallyActivatedCurrentMarker) {
				showSinglePlace(focus[0]);
			}
		}
	}

	function mapAction(container: HTMLElement) {
		map = createMap(container);
		map.on("zoomend", updateMarkers);

		map.on("click", () => {
			manuallyActivatedCurrentMarker = false;
			hideAllPlaces();
		});

		map.on("moveend", () => {
			placeLayer.needRedraw()
			latitude.set(map.getCenter().lat);
			longitude.set(map.getCenter().lng);
		})
		map.on("zoom", () => {
			placeLayer.options.sparse = 1 / map.getZoom();
			placeLayer.needRedraw();
		})

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				if (!$latitude) {
					latitude.set(position.coords.latitude);
				}

				if (!$longitude) {
					longitude.set(position.coords.longitude);
				}

				map.setView([$latitude, $longitude], 12);


				const location = placeLayer.addCustomIcon("LOC", L.latLng($latitude, $longitude));
				updateMarkers();
			});
		}

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