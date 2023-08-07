<script lang="ts">
	import Plus from "./Icons/Plus.svelte";

	export let href: string;
</script>

<a
	class="fixed z-[100000] bottom-8 right-8 rounded-full bg-slate-900 p-4 hover:bg-slate-800"
	{href}>
	<Plus width={20} height={20}></Plus>
</a>
