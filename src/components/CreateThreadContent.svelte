<script lang="ts">
	import Tags from "svelte-tags-input";
  import { addNotification } from "./NotificationStore";

	export let forum: number;

	let title: string = "";
	let description: string = "";
	let tags: string[] = [];

	async function createThread() {
		if (title.length > 250) {
			addNotification({
				message: "We're very sorry, but you can't have more than 250 characters in your title. Maybe you can shorten that somehow?",
				type: "error",
				dismissible: false,
				timeout: 3000
			})
		}

		if (description.length > 15000) {
			addNotification({
				message: "We're very sorry, but you can't have more than 15000 characters per message. Maybe you can shorten that somehow?",
				type: "error",
				dismissible: false,
				timeout: 3000
			})
		}

		const response = await fetch(`/api/thread`, {
			method: "PUT",
			body: JSON.stringify({
				forum,
				title,
				description,
				tags
			})
		});

		console.log(response)
	}
</script>

<h1>Create a new Thread</h1>
<div>
	<span>Title</span>
	<input
		type="text"
		placeholder="Title"
		maxlength="250"
		bind:value={title} />
	<span class="text-gray-400">{title.length}/250</span>
</div>
<div>
	<span>Tags</span>
	<Tags bind:tags={tags} minChars={1} maxTags={5} splitWith={" "} allowPaste={true} addKeys={[13,32]}></Tags>
	<span class="text-gray-400">{tags.length}/5</span>
</div>
<div>
	<span>Question/Message</span>
	<textarea
		placeholder="Message"
		cols="30"
		rows="10"
		maxlength="15000"
		bind:value={description} />
	<span class="text-gray-400">{description.length}/15000</span>
</div>
<button on:click={createThread} class="button">Create Thread!</button>
