<script lang="ts">
	import type { Editor } from "@tiptap/core";
	import FontBold from "../Icons/FontBold.svelte";
	import FontHeading from "../Icons/FontHeading.svelte";
	import FontItalic from "../Icons/FontItalic.svelte";
	import Underline from "../Icons/Underline.svelte";
	import Pilcrow from "../Icons/Pilcrow.svelte";

	export let editor: Editor;
</script>

<div class="bg-stone-800 text-stone-200 px-2 py-1.5 rounded-lg flex items-center">
	<button on:click={() => {
		editor.chain().toggleHeading({ level: 2 }).focus().run()
	}}><FontHeading width={20} height={20} class="fill-stone-400 hover:fill-stone-50 {editor?.isActive("heading") ? "active" : ""}"></FontHeading></button>
	<button on:click={() => {
		editor.chain().toggleBold().focus().run()
	}}><FontBold width={20} height={20} class="fill-stone-400 hover:fill-stone-50 {editor?.isActive("bold") ? "active" : ""}"></FontBold></button>
	<button on:click={() => {
		editor.chain().toggleItalic().focus().run()
	}}><FontItalic width={20} height={20} class="fill-stone-400 hover:fill-stone-50 {editor?.isActive("italic") ? "active" : ""}"></FontItalic></button>
	<button on:click={() => {
		editor.chain().toggleUnderline().focus().run()
	}}><Underline width={20} height={20} class="fill-stone-400 hover:fill-stone-50 {editor?.isActive("underline") ? "active" : ""}"></Underline></button>
	<button on:click={() => {
		editor.chain().toggleBlockquote().focus().run()
	}}><Pilcrow width={20} height={20} class="fill-stone-400 hover:fill-stone-50 {editor?.isActive("blockquote") ? "active" : ""}"></Pilcrow></button>
</div>

<style>
	:global(.active) {
		@apply fill-stone-50;
	}
</style>