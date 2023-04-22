<script lang="ts">
	import "leaflet-canvas-markers";
	import L, { LatLngExpression } from "leaflet";
	let map: L.Map;

	export let latitude: number;
	export let longitude: number;

	export let onclick: (e: L.LeafletMouseEvent) => void;

	export let addMarker: (latlng: L.LatLng, type: string) => void;
	export let removeMarker: (marker: L.Marker) => void;


	let initialView: LatLngExpression = [0, 0];
	// Get the current user location.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			map.setView([position.coords.latitude, position.coords.longitude], 12);
		});
	}

	let markers = new Map();

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

		addMarker = ({ lat, lng }, type) => {
			let marker = L.canvasMarker({ lat, lng }, {
			img: {
				url: `/icons/${type}.svg`,
				size: [28, 38],
				rotate: 0,
				offset: { x: 0, y: -19 }
			}
		});
			marker.addTo(map)
			map.setView({ lat, lng })
			markers.set(marker, marker)

			return marker;
		}

		removeMarker = (marker: L.Marker) => {
			const found = markers.get(marker)

			if (found) {
				map.removeLayer(found)
			}

			markers.delete(marker);
		}

		return map;
	}

	function mapAction(container: HTMLElement) {
		map = createMap(container);

		map.on("click", onclick)

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

	$: map && map.setView({ lat: latitude, lng: longitude }, 12);
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