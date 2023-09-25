<script lang="ts">
	import Image from "~/components/Icons/Image.svelte";
	import ImageSelectionOverlay from "../../ImageSelectionOverlay.svelte";

	let selectedImages: Record<string, boolean> = {};
	let inlineImageSelectionOverlayVisible: boolean = false;
</script>

<Image width={25} height={25} class="fill-stone-200"></Image>

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