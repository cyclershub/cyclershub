<script lang="ts">
	import moment from "moment";
	import { addNotification, updateNotification } from "../NotificationStore";
	import Overlay from "../Overlay.svelte";
	import UploadArea from "../UploadArea.svelte";
	import { createEventDispatcher } from "svelte";
	import Checkmark from "../Icons/Checkmark.svelte";

	const dispatch = createEventDispatcher();

	export let visible: boolean = false;
	export let images: {
		uid: string;
		alt: string;
		category: string;
		created_on: string;
	}[];

	let selectedImages: Record<string, boolean> = {};
</script>

<Overlay bind:visible>
	<div
		class="bg-stone-50 max-w-[1440px] w-full h-[80vh] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-4">
		<div class="grid grid-cols-4 gap-4">
			{#each images as image}
				<button
					on:click={() => {
						selectedImages[image.uid] = !selectedImages[image.uid];
						selectedImages = selectedImages;
					}}
					class:border-4={selectedImages[image.uid] == true}
					class="border-green-600">
					<img
						src="/api/image/{image.uid}.jpg"
						alt={image.alt}
						class="aspect-video object-cover" />
				</button>
			{/each}
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
										category: "",
										created_on: moment().format("YYYY-MM-DD HH:mm:ss"),
									},
								];
								uploaded++;
								updateNotification(notification, {
									message: `${uploaded} of ${files.length} images uploaded, we're getting there...`,
								});

								if (uploaded == files.length) {
									updateNotification(notification, {
										timeout: 3000,
									});
								}
							}
						};
						reader.readAsDataURL(file);
					}
				}}>
				<span class="text-stone-400 font-semibold text-sm">Upload Images</span>
			</UploadArea>
			<button
				on:click={() => {
					visible = false;

					dispatch("select", {
						images: Object.keys(selectedImages).filter(
							(x) => selectedImages[x] == true
						),
					});
					selectedImages = {};
				}}
				class="bg-stone-50 rounded-full p-2 absolute right-4 bottom-4 border-green-600 border-2"
				class:invisible={Object.values(selectedImages).filter((x) => x == true)
					.length == 0}
				class:visible={Object.values(selectedImages).filter((x) => x == true)
					.length > 0}>
				<Checkmark
					width={20}
					height={20}
					class="fill-green-600" />
			</button>
		</div>
	</div>
</Overlay>
