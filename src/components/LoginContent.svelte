<script lang="ts">
	import Button from "./Button.svelte";
	import cookie from "cookiejs"
  import { addNotification } from "./NotificationStore";

	let username: string;
	let password: string;

	async function loginUser() {
		let result = await fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({
				username,
				password,
			}),
		}).then((r) => r.json());

		if (result.success == true) {
			cookie.set("token", result.data.token);
			cookie.set("expires", result.data.expires);
			window.location.href = "/user";
		} else {
			addNotification({
				message: "That didn't work! Did you enter your username and password correctly?",
				type: "error",
				dismissible: false,
				timeout: 3000
			})
		}
	}
</script>

<div class="w-full h-full flex justify-center items-center">
	<div
	class="max-w-[350px]"
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<span class="text-slate-900 text-lg font-semibold">Username</span>
			<input
				type="text"
				placeholder="YourUsername"
				bind:value={username}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span class="text-slate-900 text-lg font-semibold">Password</span>
			<input
				type="password"
				placeholder="********"
				bind:value={password}
			/>
		</div>
		<div
			class="flex flex-col gap-4 sm:flex-row items-center justify-between"
		>
			<Button on:click={loginUser}>Login</Button>
			<a href="/user/signup">Register instead</a>
		</div>
	</div>
</div>
</div>
