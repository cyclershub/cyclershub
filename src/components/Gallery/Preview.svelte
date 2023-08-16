<script lang="ts">
	interface GalleryEntry {
		uid: string;
		title: string;
		author: string;
		cover: string;
		tags?: string[]
		category?: string;
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
		<h3 class="text-stone-900 font-semibold mb-2">{entry.title}</h3>
		<div class="flex flex-row flex-wrap gap-2">
			{#if entry.category}
			<span class="px-2 py-0.5 text-stone-800 bg-stone-50 text-xs rounded-sm font-semibold">{entry.category}</span>
			{/if}
			{#if entry.tags}
				{#each entry.tags as tag}
					<span class="px-2 py-0.5 text-stone-50 bg-stone-800 text-xs rounded-sm font-semibold">{tag}</span>
				{/each}
			{/if}
		</div>
	</div>
</a>
