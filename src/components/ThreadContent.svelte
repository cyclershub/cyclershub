<script lang="ts">
	import moment from "moment";
	import Share from "~/components/Icons/Share.svelte";
	import type { Message, Thread, User } from "~/lib/types";
	import TriangleUp from "./Icons/TriangleUp.svelte";
	import TriangleDown from "./Icons/TriangleDown.svelte";
	import Bookmark from "./Icons/Bookmark.svelte";
  import Badge from "./Badge.svelte";

	type MessageFromUser = Message & { user: User };

	export let thread: Thread;
	export let forum: string;
	export let messages: MessageFromUser[];

	async function copyLinkToClipboard(str: string) {
		try {
			await navigator.clipboard.writeText(str);
		} catch (err) {
			// Create a temporary textarea element to hold the string
			const tempTextArea = document.createElement("textarea");
			tempTextArea.value = str;

			// Add the temporary element to the DOM to enable the "copy" command
			document.body.appendChild(tempTextArea);

			// Select the string in the temporary textarea
			tempTextArea.select();

			// Execute the "copy" command
			document.execCommand("copy");

			// Remove the temporary element from the DOM
			document.body.removeChild(tempTextArea);
		}
	}

	let hasUpvoted = false;
	let hasDownvoted = false;

	async function upvoteMessage(message: MessageFromUser) {
		const response = await fetch("/api/forum/upvote", {
			method: "POST",
			body: JSON.stringify({
				message_uid: message.uid,
			}),
		});

		const json = await response.json();

		if (json.success) {
			message.votes = json.data.votes;
			hasUpvoted = json.data.voted;
			if (hasDownvoted) {
				hasDownvoted = false;
			}
			messages = messages;
		}
	}

	async function downvoteMessage(message: MessageFromUser) {
		const response = await fetch("/api/forum/downvote", {
			method: "POST",
			body: JSON.stringify({
				message_uid: message.uid,
			}),
		});

		const json = await response.json();

		if (json.success) {
			message.votes = json.data.votes;
			hasDownvoted = json.data.voted;
			if (hasUpvoted) {
				hasUpvoted = false;
			}
			messages = messages;
		}
	}
</script>

{#each messages as message, i}
	<div class="flex flex-row gap-4 border rounded-lg p-2">
		<div class="flex flex-col py-2 px-4 w-max items-center">
			<a href="/user/{message.user.uid}">
				<img
					src={message.user.profile_picture || "/user-placeholder.svg"}
					alt=""
					class="w-16 h-16 rounded-full" />
			</a>
			<div class="flex flex-col items-center">
				<TriangleUp
					class="fill-gray-400 cursor-pointer {hasUpvoted ? 'active' : ''}"
					on:click={() => {
						upvoteMessage(message);
					}}
					width={50}
					height={50} />
				<span class="text-blue-400 text-2xl select-none">{message.votes}</span>
				<TriangleDown
					class="fill-gray-400 cursor-pointer {hasDownvoted ? 'active' : ''}"
					on:click={() => {
						downvoteMessage(message);
					}}
					width={50}
					height={50} />
			</div>
		</div>
		<div class="w-full">
			{#if i == 0}
				<h1 class="flex flex-row items-center gap-4 justify-between">
					{thread.title}
					<div class="flex flex-row gap-4 items-center">
						<Share
							width={25}
							height={25}
							on:click={async () => {
								const response = await fetch(
									"https://shrty.it/api/shorten.json",
									{
										method: "POST",
										body: JSON.stringify({
											url: window.location.href,
										}),
									}
								);

								const json = await response.json();

								if (json.success == false) {
									return;
								}

								await copyLinkToClipboard(
									`https://shrty.it/${json.data.shortcode}`
								);
							}}
							class="cursor-pointer inline hover:bg-gray-200 rounded-lg p-2 w-10 h-10" />
						<Bookmark
							width={25}
							height={25}
							class="cursor-pointer inline hover:bg-gray-200 rounded-lg p-2 w-10 h-10" />
					</div>
				</h1>
				<span class="text-gray-400">Asked by <a class="text-blue-500 hover:text-blue-700" href="/user/{message.user.uid}">{message.user.username}</a> on {moment(message.created_on).format("MMM DD, YYYY")}</span>
				<div class="flex flex-row gap-4">
					{#each thread.tags || [] as tag}
					<Badge block={true} href="/forum/{forum}/?t={tag}">{tag}</Badge>
				{/each}
				</div>
				<hr class="my-2 border-dashed">
			{/if}
			<p>{message.body}</p>
		</div>
	</div>
{/each}

<style>
	:global(.active) {
		@apply fill-gray-600;
	}
</style>
