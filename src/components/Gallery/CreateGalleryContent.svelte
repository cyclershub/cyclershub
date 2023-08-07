<script lang="ts">
  import { addNotification } from "../NotificationStore";
	import { Editor, Viewer } from "bytemd";

	export let forum: number;

	let title: string = "";
	let body: string = "";

	async function createThread() {
		if (title.length > 250) {
			addNotification({
				message: "We're very sorry, but you can't have more than 250 characters in your title. Maybe you can shorten that somehow?",
				type: "error",
				dismissible: false,
				timeout: 3000
			})
		}

		if (body.length > 15000) {
			addNotification({
				message: "We're very sorry, but you can't have more than 15000 characters per message. Maybe you can shorten that somehow?",
				type: "error",
				dismissible: false,
				timeout: 3000
			})
		}

		const response = await fetch(`/api/gallery.json`, {
			method: "PUT",
			body: JSON.stringify({
				title,
				body,
				images: images.map(image => image.uid)
			})
		});

		const json = await response.json()

		if (json.success) {
			location.href = "/gallery";
		}
	}

	let images: { base64: string, uid: string }[] = [];

	function onFileChange(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files) return;

		// Check each file if it's an image and upload it as base64
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!file.type.startsWith("image/")) {
				addNotification({
					message: `File ${file.name} is not an image. Please only upload images.`,
					type: "error",
					dismissible: false,
					timeout: 3000
				})
				continue;
			}

			const reader = new FileReader();
			reader.onload = async () => {
				const base64 = reader.result as string;
				const response = await fetch(`/api/image.json`, {
					method: "PUT",
					body: JSON.stringify({
						alt: "awdaawdawdawd",
						category: "aawdkad",
						base64
					})
				});
				const json = await response.json();
				
				if (json.success === true) {
					images.push({
						base64,
						uid: json.data.uid
					})
					images = images;
				}
			}
			reader.readAsDataURL(file);
		}
	}

	let value;
	const plugins = [];

	function handleChange(e) {
		value = e.detail.value;
	}
</script>

<h1>Create a new gallery entry</h1>
<div>
	<span>Title</span>
	<input
		type="text"
		placeholder="Title"
		maxlength="250"
		bind:value={title} />
	<span class="text-gray-400">{title.length}/250</span>
</div>
<div>
	<span>Article</span>
	<textarea
		placeholder="Message"
		cols="30"
		rows="10"
		maxlength="15000"
		bind:value={body} />
	<span class="text-gray-400">{body.length}/15000</span>
</div>
<input type="file" multiple on:change={onFileChange}>
<div class="flex flex-row flex-wrap gap-4">
	{#each images as image}
		<img src={image.base64} class="max-w-[200px] h-auto object-cover" alt={image.uid} />
	{/each}
</div>
<button on:click={createThread} class="button">Create Entry!</button>