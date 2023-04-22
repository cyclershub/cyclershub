<script lang="ts">
	import { BareLeafletMap } from "./LeafletMap";


	let addMarker: any;
	let removeMarker: any;

	let lat: number;
	let lng: number;
	let type: string;

	let description: string = "";
	let title: string = "";

	function getUserLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				lat = position.coords.latitude;
				lng = position.coords.longitude
			});
		}
	}

	getUserLocation();

	async function submitPlaceData() {
		const response = await fetch("/api/places", {
			method: "PUT",
			body: JSON.stringify({
				lat, lng, type, description, title
			})
		});

		const json = await response.json();

		console.log(json)
	}

	function setMarkerOnClickedPosition(e: L.LeafletMouseEvent) {
		lat = e.latlng.lat;
		lng = e.latlng.lng;
	}

	let lastMarker: L.Marker;
	$: {
		if (lat && lng && addMarker && type) {
			if (lastMarker) {
				removeMarker(lastMarker)
			}

			lastMarker = addMarker({ lat, lng }, type)
		}
	}
</script>

<h1>Add a new Place</h1>
<p>
	Thank you for improving our site by adding a new place to our database. That
	way, others can find even more and we'll uncover the world of cycling!
</p>

<div class="grid grid-cols-[2fr,1.5fr] gap-4">
	<div>
		<span>Title</span>
		<input
			type="text"
			placeholder="Please enter a title for your place."
			bind:value={title}
			maxlength="150" />
		<span class="text-gray-400 block mb-4">{title.length}/150</span>

		<span>Description</span>
		<textarea
			cols="30"
			rows="10"
			placeholder="Please enter at least 100 characters that describe this place."
			minlength="100"
			maxlength="2500"
			bind:value={description} />
		<span class="text-gray-400 block mb-4">{description.length}/2500</span>

		<span>Location</span>
		<div class="flex flex-row gap-4">
			<input
				type="number"
				placeholder="Latitude"
				bind:value={lat} />
			<input
				type="number"
				placeholder="Longitude"
				bind:value={lng} />
			<button on:click={getUserLocation} class="w-full">My Location</button>
		</div>
		<span>Type</span>
		<select bind:value={type}>
			<option value="PN">Surrounded by Nature</option>
			<option value="C">Camping</option>
			<option value="AR">Rest Area</option>
			<option value="P">Parking Lot</option>
			<option value="ACC_P">Motorhome Parking (Paid)</option>
			<option value="ACC_PR">Motorhome Parking (Private)</option>
			<option value="DS">Other Services</option>
			<option value="BC">Bike Charging Station</option>
		</select>
		<button on:click={submitPlaceData}>Create your Place!</button>
	</div>
	<div class="border rounded-lg">
		<BareLeafletMap
		onclick={setMarkerOnClickedPosition}
		bind:removeMarker={removeMarker}
		bind:addMarker={addMarker}
			latitude={0}
			longitude={0} />
	</div>
</div>
