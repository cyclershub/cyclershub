<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import BubbleMenu from "@tiptap/extension-bubble-menu";
	import BubbleMenuElement from "./BubbleMenuElement.svelte";
	import Blockquote from "@tiptap/extension-blockquote";
	import Image from "@tiptap/extension-image";

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let content: string;
	let element: HTMLDivElement;
	export let editor: Editor;
	let menu: HTMLDivElement;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Blockquote,
				BubbleMenu.configure({
					element: menu,
					shouldShow: ({ editor }) => !editor.view.state.selection.empty,
				}),
				Image.configure({
					inline: false,
				})
			],
			content,
			onTransaction: ({ transaction }) => {
				// force re-render so `editor.isActive` works as expected
				dispatch("transaction", { editor, transaction });
				editor = editor;
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={menu}>
	<BubbleMenuElement bind:editor />
</div>

<div
	bind:this={element}
	class="w-full h-full" />

<style>
	:global(.ProseMirror) {
		outline: none;
	}

	:global(.ProseMirror .ProseMirror-selectednode) {
		@apply outline-stone-600 outline-2 outline;
	}


	:global(.ProseMirror img) {
		@apply max-w-none;
	}

	/* 2 images */
	:global(.ProseMirror img:has(+ img)) {
		@apply inline w-[492px] ml-[-100px] mr-4;
	}

	:global(.ProseMirror img + img) {
		@apply inline w-[492px] mr-[-100px];
	}

	/* 3 images */
	:global(.ProseMirror img:has(+ img + img)) {
		@apply w-[1000px] ml-[-100px] block mb-4;
	}

	:global(.ProseMirror img + img:has(+ img)) {
		@apply inline w-[492px] ml-[-100px] mr-4;
	}

	:global(.ProseMirror img + img + img) {
		@apply inline w-[492px] mr-[-100px];
	}

	/* 4 images */
	:global(.ProseMirror img:has(+ img + img + img)) {
		@apply inline w-[492px] ml-[-100px] mr-4;
	}

	:global(.ProseMirror img + img:has(+ img + img)) {
		@apply inline w-[492px] mr-[-100px] ml-0;
	}

	:global(.ProseMirror img + img + img:has(+ img)) {
		@apply inline w-[492px] ml-[-100px] mr-4;
	}

	:global(.ProseMirror img + img + img + img) {
		@apply inline w-[492px] mr-[-100px] ml-0;
	}

	/* 5 images */
	:global(.ProseMirror img:has(+ img + img + img + img)) {
		@apply inline w-[492px] ml-[-100px] mr-4;
	}

	:global(.ProseMirror img + img:has(+ img + img + img)) {
		@apply inline w-[492px] mr-[-100px] ml-0;
	}

	:global(.ProseMirror img + img + img:has(+ img + img)) {
		@apply inline w-[322px] ml-[-100px] mr-4 mb-0;
	}

	:global(.ProseMirror img + img + img + img:has(+ img)) {
		@apply inline w-[322px] ml-0 mr-4;
	}

	:global(.ProseMirror img + img + img + img + img) {
		@apply inline w-[322px] mr-[-100px] ml-0;
	}
</style>
