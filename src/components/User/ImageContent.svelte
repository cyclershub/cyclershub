<script lang="ts">
	import type { User } from "~/lib/types";
	import Grid from "../Icons/Grid.svelte";
	import ListBullet from "../Icons/ListBullet.svelte";
	import Small from "../Queries/Small.svelte";
	import UploadArea from "../UploadArea.svelte";
	import { addNotification, updateNotification } from "../NotificationStore";

	export let user: User;
	export let images: any[];

	let gridView = true;
</script>

<div class="px-4">
	<div class="flex flex-row justify-between items-center mb-4">
		<h1>Your images</h1>
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
					message: `${uploaded} of ${files.length} images uploaded, this might take a while...`,
					dismissible: true,
				});

				for (const file of files) {
					// Check the mime type if it's a valid image
					if (!file.type.startsWith("image/")) {
						continue;
					}

					const reader = new FileReader();

					reader.onload = async (e) => {
						const data = reader.result;

						const res = await fetch("/api/image.json", {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								base64: data,
								alt: file.name || "Alt text",
								category: "user_submitted",
							}),
						});
						const json = await res.json();

						if (json.success === true) {
							images = [
								...images,
								{
									uid: json.data.uid,
									alt: file.name,
								},
							];
							uploaded++;
							updateNotification(notification, {
								message: `${uploaded} of ${files.length} images uploaded, we're getting there...`,
							});

							if (uploaded == files.length) {
								updateNotification(notification, {
								timeout: 3000
							});
							}
						}
					};
					reader.readAsDataURL(file);
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
	{#if gridView}
		<div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
			{#each images as image, i}
				<div class="relative cursor-pointer group" on:click={async () => {
					await navigator.clipboard.writeText(`http://localhost:3000/api/image/${image.uid}.png`);
				}}>
					<img
					src={`/api/image/${image.uid}.png`}
					loading="lazy"
					class="h-auto object-cover mb-4 group-hover:brightness-50 transition-all" />
					<div class="absolute p-4 top-0 left-0 w-full h-full flex flex-col justify-between">
						<span class="text-stone-200 font-semibold invisible group-hover:visible">{image.alt}</span>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col scrollbar-hide gap-4 items-center">
			{#each images as image, i}<img
					src={`/api/image/${image.uid}.png`}
					loading="lazy"
					class="h-auto object-cover" />
			{/each}
		</div>
	{/if}
</div>
