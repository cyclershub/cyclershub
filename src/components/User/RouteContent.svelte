<script lang="ts">
	import type { User } from "~/lib/types";
	import Grid from "../Icons/Grid.svelte";
	import ListBullet from "../Icons/ListBullet.svelte";
	import Small from "../Queries/Small.svelte";
	import UploadArea from "../UploadArea.svelte";
	import { addNotification, updateNotification } from "../NotificationStore";
	import LeafletGPXMap from "../LeafletGPXMap.svelte";

	export let user: User;
	export let routes: any[];

	let gridView = true;
</script>

<div class="px-4">
	<div class="flex flex-row justify-between items-center mb-4">
		<h1>Your routes</h1>
		<Small>
			<div class="flex flex-row gap-4">
				<button on:click={() => (gridView = false)}>
					<ListBullet
						width={25}
						height={25}
						class="fill-black-brown" />
				</button>
				<button on:click={() => (gridView = true)}>
					<Grid
						width={25}
						height={25}
						class="fill-black-brown" />
				</button>
			</div>
		</Small>
	</div>

	<div class="mb-4">
		<UploadArea
			on:upload={(ev) => {
				let files = ev.detail.files;
				let uploaded = 0;

				let notification = addNotification({
					type: "info",
					message: `${uploaded} of ${files.length} routes uploaded, this might take a while...`,
					dismissible: true,
				});

				for (const file of files) {
					// Check the mime type if it's a valid image
					if (file.type !== "application/gpx+xml") {
						continue;
					}

					const reader = new FileReader();

					reader.onload = async (e) => {
						const data = reader.result;

						const res = await fetch("/api/routes/upload", {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								data: data,
								name: file.name || "My fantastic route",
							}),
						});
						const json = await res.json();

						if (json.success === true) {
							routes = [
								...routes,
								{
									uid: json.data.uid,
									name: file.name,
								},
							];
							uploaded++;
							updateNotification(notification, {
								message: `${uploaded} of ${files.length} routes uploaded, we're getting there...`,
							});

							if (uploaded == files.length) {
								updateNotification(notification, {
									timeout: 3000,
								});
							}
						}
					};
					reader.readAsText(file);
				}
			}}>
			<span class="text-stone-400">
				<strong class="text-stone-400">Drop</strong>
				your files here or
				<strong class="text-stone-400">click</strong>
				to upload...
			</span>
		</UploadArea>
	</div>
	<div class="grid grid-cols-1 gap-16">
		{#each routes as route, i}
			{#await fetch(`/api/routes/${route.uid}.gpx`).then((r) => r.json())}
				<p>Fetching data...</p>
			{:then data}
				<div class="relative cursor-pointer w-full h-[70vh]">
					<LeafletGPXMap gpx={data.data.xml}/>
					<a href="/api/routes/{route.uid}" class="block">
						<span class="text-stone-600">
							{route.name}
						</span>
					</a>
				</div>
			{/await}
		{/each}
	</div>
</div>
