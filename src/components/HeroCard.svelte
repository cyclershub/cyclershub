<script lang="ts">
	export let image: string;
	export let alt: string = "";

	export let width: any = "";
	export let reverse: boolean = false;
</script>

<section
	class="rounded-lg shadow-sm grid w-full h-auto border mb-20"
	class:reverse>
	{#if reverse}
		<img
			src={image}
			{alt}
			{width}
			class="ml-auto rounded-br-lg rounded-bl-lg lg:rounded-tr-lg lg:rounded-br-lg lg:rounded-bl-none h-full object-cover" />
	{/if}
	<div class="py-8 px-6">
		<slot />
	</div>
	{#if !reverse}
		<img
			src={image}
			{alt}
			{width}
			class="ml-auto rounded-br-lg rounded-bl-lg lg:rounded-tr-lg lg:rounded-br-lg lg:rounded-bl-none h-full object-cover" />
	{/if}
</section>

<style lang="scss">
	@media (min-width: 1024px) {
		section:not(.reverse) {
			@apply grid-cols-[1fr,2fr];
		}
		.reverse {
			@apply grid-cols-[2fr,1fr];
		}
	}
</style>
