<script lang="ts">
	export let image: string;
	export let alt: string = "";

	export let width: any = "";
	export let reverse: boolean = false;
</script>

<section class="rounded-lg shadow-sm grid lg:grid-cols-[1fr,2fr] w-full h-auto border mb-20">
	{#if reverse}
	<img src={image} alt={alt} {width} class="ml-auto rounded-br-lg rounded-bl-lg lg:rounded-tr-lg lg:rounded-br-lg lg:rounded-bl-none h-full object-cover">
	{/if}
	<div class="py-8 px-6">
		<slot></slot>
	</div>
	{#if !reverse}
	<img src={image} alt={alt} {width} class="ml-auto rounded-br-lg rounded-bl-lg lg:rounded-tr-lg lg:rounded-br-lg lg:rounded-bl-none h-full object-cover">
	{/if}
</section>