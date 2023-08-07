<script lang="ts">
	interface GalleryEntry {
		uid: string;
		title: string;
		author: string;
		cover: string;
	}

	export let href: string;

	export let entry: GalleryEntry;
</script>

<a class="group overflow-hidden cursor-pointer group transition-all block relative" {href}>
	<div class="overflow-hidden">
		<img src={entry.cover} class="object-cover group-hover:scale-105 transition-all">
	</div>
	<div class="px-4 py-2 bg-stone-200 text-left">
		<span class="text-stone-400 font-semibold text-sm">{entry.author}</span>
		<h3 class="text-stone-900 font-semibold">{entry.title}</h3>
	</div>
</a>
