<script lang="ts">
	import { notifications, dismissNotification } from "./NotificationStore";
	import Close from "./Icons/Close.svelte";
  import Success from "./Icons/Success.svelte";
</script>

{#if $notifications}
	<div
		class="fixed top-[76px] left-4 w-auto h-auto flex flex-col gap-4">
		{#each $notifications as notification (notification.id)}
			<div
				class="px-4 py-2 flex flex-row items-center gap-2 justify-between notification border-l-8 border-2 rounded-xl"
				class:bg-red-100={notification.type == "error"}
				class:bg-green-100={notification.type == "success"}
				class:bg-blue-100={notification.type == "info"}
				class:border-l-red-400={notification.type == "error"}
				class:border-l-green-400={notification.type == "success"}
				class:border-l-blue-400={notification.type == "info"}
				class:border-red-200={notification.type == "error"}
				class:border-green-200={notification.type == "success"}
				class:border-blue-200={notification.type == "info"}>
				{#if notification.type == "success"}
						<Success width={20} height={20} class="fill-green-600"></Success>
					{/if}
				<p class="text-gray-600 mb-0 text-lg">
					
					{notification.message}</p>
				{#if notification.dismissible}
					<Close
						width={15}
						height={15}
						class="cursor-pointer fill-gray-500"
						on:click={() => {
							dismissNotification(notification.id);
						}} />
				{/if}
			</div>
		{/each}
	</div>
{/if}


<style>
	.notification {
		animation: move-in-left 400ms ease 0s 1 forwards;
	}

	@keyframes move-in-left {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: none;
		}
	}
</style>