<script lang="ts">
	import "leaflet-canvas-markers";
	import L, { LatLngExpression } from "leaflet";
  import type { Place } from "../Places";
  import { getIcon } from "../../lib/getIcon";
	let map: L.Map;

	export let latitude: number;
	export let longitude: number;

	let manuallyActivatedCurrentMarker: boolean = false;


	let initialView: LatLngExpression = [0, 0];
	// Get the current user location.

	function createMap(container: HTMLElement) {
		let map = L.map(container, { preferCanvas: true }).setView(initialView, 12);
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

	function createCanvasMarker(location: { lat: number, lng: number }, type: string) {
		let marker = L.canvasMarker({ lat: location.lat, lng: location.lng }, {
			img: {
				url: `/icons/${type}.svg`,
				size: [28, 38],
				rotate: 0,
				offset: { x: 0, y: -19 }
			}
		});

		return marker
	}

	export let currentlyVisibleMarker: Place | null;
	async function createMarker(location: Place): Promise<L.Marker<any>> {
		const marker = createCanvasMarker({ lat: location.lat, lng: location.lng }, location.type);

		let clickMarker = L.marker({ lat: location.lat, lng: location.lng }, { opacity: 0 }).addTo(map)

		clickMarker.on("mouseover", () => {
			if (marker.options.img) {
				marker.options.img.offset.y = -24;
			}
			map.removeLayer(marker);
			map.addLayer(marker)
		})

		clickMarker.on("mouseout", () => {
			if (marker.options.img) {
				marker.options.img.offset.y = -14;
			}
			map.removeLayer(marker);
			map.addLayer(marker)
			map.setView(map.getCenter())
		})

		clickMarker.on("click", () => {
			manuallyActivatedCurrentMarker = true;
			currentlyVisibleMarker = location;
			latitude = location.lat;
			longitude = location.lng;
		})

		return marker;
	}

	const places = new Map<number, any>();

	async function updateMarkers() {
		const center = map.getCenter();

		// Get places from park4night api.
		const response = await fetch(
			`/api/places?lat=${center.lat}&lng=${center.lng}&radius=50`,
			{
				method: "GET"
			}
		);

		const json = await response.json();

		if (json.type == "success") {
			for (const place of json.data) {
				if (places.has(place.id)) {
					continue;
				}
				places.set(place.id, place);
				let marker = await createMarker(place)
				marker.addTo(map)
			}

			const focus = json.data.sort((a: Place,b: Place) => a.distance - b.distance);
			
			if (focus.length > 0 && !manuallyActivatedCurrentMarker) {
				currentlyVisibleMarker = focus[0];
			}
		}
	}

	function mapAction(container: HTMLElement) {
		map = createMap(container);
		map.on("dragend", updateMarkers);
		map.on("zoomend", updateMarkers);

		map.on("click", () => {
			manuallyActivatedCurrentMarker = false;
			currentlyVisibleMarker = null;
		})

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				if (!latitude) {
					latitude = position.coords.latitude;
				}

				if (!longitude) {
					longitude = position.coords.longitude;
				}

				map.setView([latitude, longitude], 12);

				let marker = createCanvasMarker({ lat: latitude, lng: longitude }, "LOC");
				marker.addTo(map)
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
			map.setView({ lat: latitude, lng: longitude }, 12)
			updateMarkers()
		}
	};
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