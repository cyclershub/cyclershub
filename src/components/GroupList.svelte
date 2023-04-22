<script lang="ts">
	import Box from "./Box.svelte";
	import Card from "./Card.svelte";

	interface Group {
		desc: string;
		name: string;
		link: string;
		image: string;
		category: string;
	}

	export let groups: Group[];

	const buckets: Record<string, Group[]> = {};

	// Sort all groups by category into buckets.
	for (const group of groups) {
		if (buckets.hasOwnProperty(group.category)) {
			buckets[group.category].push(group);
		} else {
			buckets[group.category] = [group];
		}
	}
</script>

{#each Object.entries(buckets) as [category, groups]}
	<Box>
		<h2>{category}</h2>
		<div class="grid grid-cols-3 gap-4">
			{#each groups as group}
				<Card
					image={group.image}
					href={group.link}>
					<h2>{group.name}</h2>
					<p>{group.desc}</p>
				</Card>
			{/each}
		</div>
	</Box>
{/each}
