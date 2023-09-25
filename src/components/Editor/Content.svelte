<script lang="ts">
	import "../../style/article.scss"

	import Image from "../Icons/Image.svelte";
	import Plus from "../Icons/Plus.svelte";
	import TipTapEditor from "./TipTapEditor.svelte";
	import { addNotification } from "../NotificationStore";
	import type { Editor } from "@tiptap/core";
	import ImageSelectionOverlay from "./ImageSelectionOverlay.svelte";
	import * as ImagePlugin from "./plugins/Image/ImagePlugin";
	import * as AudioPlugin from "./plugins/Audio/AudioPlugin";

	let showAddDropout = false;

	export let images: { uid: string, alt: string, category: string, created_on: string }[]
	export let content: string;
	export let title: string;
	export let cover: string;

	const plugins = [ImagePlugin, AudioPlugin];

	let inlineImageSelectionOverlayVisible: boolean = false;
	let coverImageSelectionOverlay: boolean = false;
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
			class="absolute left-[-180px] bottom-3">
			<Plus
				width={45}
				height={45}
				class="p-2 border rounded-full" />
			{#if showAddDropout}
				<div
					class="flex flex-col gap-2 rounded-xl absolute top-[calc(100%+8px)] left-[50%] translate-x-[-50%] bg-stone-900 text-stone-200 px-2 py-1.5 z-10">
					{#each plugins as {activate, Component}}
						<button on:click={activate}><Component></Component></button>
					{/each}
					<button
						on:click={() => {
							inlineImageSelectionOverlayVisible = true;
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

<ImageSelectionOverlay bind:visible={inlineImageSelectionOverlayVisible} images={images} on:select={() => {
	for (const uid in selectedImages) {
		const image = images.find((image) => image.uid == uid);

		if (!image) continue;

		let selection = editor.state.selection;

		editor.chain().focus().setImage({
			src: `/api/image/${image.uid}.jpg`,
			alt: image.alt,
		}).setTextSelection(selection).run();
	}
}}></ImageSelectionOverlay>

<ImageSelectionOverlay bind:visible={coverImageSelectionOverlay} images={images} on:select={({ detail: { images }}) => {
	cover = images[0];
}}></ImageSelectionOverlay>

<svelte:window on:keydown={(ev) => {
	if (ev.ctrlKey && ev.key == "s") {
		ev.preventDefault();
		ev.stopPropagation();

		let content = editor.getHTML();

		let method = "PUT";
		let body = {
			title: titleElement.value,
			content,
			cover: cover ? `http://localhost:3000/api/image/${cover}.jpg` : "",
		};

		let params = new URLSearchParams(window.location.search);
		if (params.get("uid")) {
			method = "POST";
			body.uid = params.get("uid");
		}
		

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

<button class="bg-green-600 fixed bottom-20 right-8 px-6 py-1.5 rounded-lg text-white font-bold hover:shadow-md transition-shadow" on:click={() => {
	coverImageSelectionOverlay = true;
}}>Choose Cover</button>
<button class="bg-green-600 fixed bottom-8 right-8 px-6 py-1.5 rounded-lg text-white font-bold hover:shadow-md transition-shadow">Publish</button>
