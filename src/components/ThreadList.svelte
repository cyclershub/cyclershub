<script lang="ts">
  import moment from "moment";
  import type { Thread } from "~/lib/types";
  import Heart from "./Icons/Heart.svelte";
  import EyeOpen from "./Icons/EyeOpen.svelte";

	

	export let threads: Thread[];
	export let forum: number;
</script>

<div class="flex flex-col gap-4">
	{#each threads as thread}
		<a class="rounded-lg px-4 py-2 border shadow-sm flex flex-row gap-4" href="/forum/{forum}/{thread.uid}">
			<div class="flex flex-col">
				<span class="flex flex-row gap-4 items-center"><Heart width={20} height={20} /> {thread.votes}</span>
				<span class="flex flex-row gap-4 items-center"><EyeOpen width={20} height={20} /> {thread.view_count}</span>
			</div>
			<div>
				<span>{moment(thread.created_on).format("MM.YYYY")}</span>
				<h2 class="break-all">{thread.title}</h2>
			</div>
		</a>
	{/each}
</div>