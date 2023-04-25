<script lang="ts">
	export let image: string | undefined = undefined;
	export let alt: string = "";
	export let href: string = "";
</script>

<a
	class="rounded-lg shadow-sm w-full h-auto border flex flex-col gap-4 hover:shadow-md transition-shadow"
	{href}>
	{#if image}
		<img
			src={image}
			{alt}
			class="rounded-tr-lg rounded-tl-lg" />
	{/if}
	<div class="py-8 px-6">
		<slot />
	</div>
</a>
