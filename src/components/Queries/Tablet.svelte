<script lang="ts">
	import MediaQuery from "svelte-media-queries";

</script>

<MediaQuery query="(min-width: 768px)" let:matches>
	{#if matches}
		<slot></slot>
	{/if}
</MediaQuery>