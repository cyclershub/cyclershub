<script lang="ts">
	import moment from "moment";
	import "../../style/article.scss"

	import Image from "../Icons/Image.svelte";
	import Plus from "../Icons/Plus.svelte";
	import UploadArea from "../UploadArea.svelte";
	import TipTapEditor from "./TipTapEditor.svelte";
	import { addNotification, updateNotification } from "../NotificationStore";
	import Overlay from "../Overlay.svelte";
	import type { Editor } from "@tiptap/core";
	import Checkmark from "../Icons/Checkmark.svelte";

	let showAddDropout = false;

	export let images: { uid: string, alt: string, category: string, created_on: string }[]
	export let content: string;
	export let title: string;

	let overlayVisible: boolean = false;
	let editor: Editor;
	let selectedImages: Record<string, boolean> = {};
	let titleElement: HTMLInputElement;
</script>

<div class="max-w-[800px] w-full mx-auto">
	<input type="text" placeholder="Title..." bind:this={titleElement} class="border-none text-4xl bg-white hover:bg-white focus:bg-white mb-4" value={title} />
	<div class="flex flex-row gap-4 relative">
		<button
			on:click={() => {
				showAddDropout = !showAddDropout;
			}}
			class="absolute left-[-150px] bottom-3">
			<Plus
				width={45}
				height={45}
				class="p-2 border rounded-full" />
			{#if showAddDropout}
				<div
					class="flex flex-row gap-2 rounded-xl absolute top-[calc(100%+8px)] left-[50%] translate-x-[-50%] bg-stone-900 text-stone-200 px-2 py-1.5 z-10">
					<button
						on:click={() => {
							overlayVisible = true;
						}}>
						<Image width={25} height={25} class="fill-stone-200"></Image>
					</button>
				</div>
			{/if}
		</button>
		<article class="w-full h-full">
			<TipTapEditor content={content} bind:editor={editor} on:transaction={(ev) => {;
				
			}}></TipTapEditor>
		</article>
	</div>
</div>

<Overlay bind:visible={overlayVisible}>
	<div class="bg-stone-50 max-w-[1440px] w-full h-[80vh] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-4">
		<div class="grid grid-cols-4 gap-4">
			{#each images as image}
			<button on:click={() => {
				selectedImages[image.uid] = !selectedImages[image.uid];
				selectedImages = selectedImages
			}} class:border-4={selectedImages[image.uid] == true} class="border-green-600">
				<img src="/api/image/{image.uid}.jpg" alt={image.alt} class="aspect-video object-cover">
			</button>
		{/each}
		<UploadArea on:upload={(ev) => {
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
										created_on: moment().format("YYYY-MM-DD HH:mm:ss")
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
		}}><span class="text-stone-400 font-semibold text-sm">Upload Images</span></UploadArea>
		<button on:click={() => {
			overlayVisible = false;
			for (const uid in selectedImages) {
				const image = images.find((image) => image.uid == uid);

				if (!image) continue;

				let selection = editor.state.selection;

				editor.chain().focus().setImage({
					src: `/api/image/${image.uid}.jpg`,
					alt: image.alt,
				}).setTextSelection(selection).run();
			}
			selectedImages = {};
		}} class="bg-stone-50 rounded-full p-2 absolute right-4 bottom-4 border-green-600 border-2" class:invisible={Object.values(selectedImages).filter(x => x == true).length == 0} class:visible={Object.values(selectedImages).filter(x => x == true).length > 0}><Checkmark width={20} height={20} class="fill-green-600"></Checkmark></button>
		</div>
	</div>
</Overlay>

<svelte:window on:keydown={(ev) => {
	if (ev.ctrlKey && ev.key == "s") {
		ev.preventDefault();
		ev.stopPropagation();

		let content = editor.getHTML();

		let method = "PUT";
		let body = {
			title: titleElement.value,
			content
		};

		let params = new URLSearchParams(window.location.search);
		if (params.get("uid")) {
			method = "POST";
			body.uid = params.get("uid");
		}

		console.log(body);
		

		fetch("/api/setups/upload", {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		}).then(async (res) => {
			const json = await res.json();

			if (json.success === true) {
				addNotification({
					type: "success",
					message: "Setup saved!",
					dismissible: true,
				});

				if (method == "PUT") {
					params.append("uid", json.data.uid);
					window.history.pushState({}, document.title, `${window.location.pathname}?${params.toString()}`);
				}
			} else {
				addNotification({
					type: "error",
					message: "Something went wrong while saving the setup!",
					dismissible: true,
				});
			}
		});
	}
}}></svelte:window>

<button class="bg-green-600 fixed bottom-8 right-8 px-6 py-1.5 rounded-lg text-white font-bold hover:shadow-md transition-shadow">Publish</button>