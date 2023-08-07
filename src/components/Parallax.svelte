<script lang="ts">
	import { onMount } from "svelte";

	export let src: string;

	let container: HTMLDivElement;

	function transform() {
		container.style.transform = `translateY(${window.scrollY / 3}px)`;
	}

	onMount(transform);
</script>

<svelte:window on:scroll={transform} />

<div class="relative overflow-hidden w-full h-full">
	<div
	class="parallax"
	bind:this={container}
	style={`--background: url('${src}')`} />
</div>

<style lang="scss">
	.parallax {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* The image used */
		background-image: var(--background);

		/* Create the parallax scrolling effect */
		background-attachment: fixed;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
