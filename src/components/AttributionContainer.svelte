<script lang="ts">
	export let href: string;
	export let image: string;
	export let title: string;
	export let alt: string = "";
</script>

<a class="border w-full px-8 py-4 mb-8 flex flex-col text-center sm:text-left sm:flex-row items-center gap-8" href={href} target="_blank" rel="noreferrer">
	<img src={image} alt={alt} class="w-[80px] rounded-full aspect-square">
	<div class="flex flex-col">
		<span class="text-lg font-semibold text-stone-800">{title}</span>
		<span class="text-stone-600 text-sm"><slot></slot></span>
	</div>
</a>