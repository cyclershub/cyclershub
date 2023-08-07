<script lang="ts">
	import Close from "./Icons/Close.svelte";

	export let visible: boolean;
</script>

<div
	class="fixed top-0 left-0 bg-[rgba(0,0,0,0.8)] w-full h-full z-50"
	hidden={!visible}>
	<button class="absolute right-8 top-8 z-50" on:click={() => {
		visible = false;
	}}>
		<Close
			width={35}
			height={35}
			class="fill-white"
			 />
	</button>
	<slot />
</div>
