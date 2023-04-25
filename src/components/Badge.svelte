<script lang="ts">
	export let block: boolean = false;
	export let href: string | undefined = undefined;
</script>

<a {href}>
	<span class="rounded-lg px-1.5 py-1 bg-blue-500 text-white text-sm" class:block={block}><slot /></span>
</a>
