<script lang="ts">
  import moment from "moment";
  import ChatBubble from "./Icons/ChatBubble.svelte";
  import Reader from "./Icons/Reader.svelte";

	interface Forum {
		title: string;
		description: string;
		message_count: number;
		thread_count: number;
		created_on: string;
		id: number;
		uid: string;
	}

	export let forums: Forum[];
</script>

<div class="flex flex-col gap-4">
	{#each forums as forum}
		<a class="rounded-lg px-4 py-2 border shadow-md flex flex-row gap-8 justify-between" href="/forum/{forum.uid}/">
			<div>
				<span>{moment(forum.created_on).format("MM.YYYY")}</span>
				<h2>{forum.title}</h2>
				<p>{forum.description}</p>
			</div>
			<div class="flex flex-col justify-center items-center gap-2">
				<span class="flex flex-row gap-4 items-center"><ChatBubble width={20} height={20} /> {forum.message_count}</span>
				<span class="flex flex-row gap-4 items-center"><Reader width={20} height={20} /> {forum.thread_count}</span>
			</div>
		</a>
	{/each}
</div>