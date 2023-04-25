<script lang="ts">
  import moment from "moment";
  import type { Thread } from "~/lib/types";

	

	export let threads: Thread[];
	export let forum: number;
</script>

<div class="flex flex-col gap-4">
	{#each threads as thread}
		<a class="rounded-lg px-4 py-2 border shadow-sm flex flex-row gap-4" href="/forum/{forum}/{thread.uid}">
			<div class="flex flex-col">
				<span>{thread.votes} {thread.votes == 1 ? "vote" : "votes"}</span>
				<span>{thread.view_count} {thread.view_count == 1 ? "view" : "views"}</span>
			</div>
			<div>
				<span>{moment(thread.created_on).format("MM.YYYY")}</span>
				<h2>{thread.title}</h2>
			</div>
		</a>
	{/each}
</div>