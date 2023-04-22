<script lang="ts">
	import Button from "./Button.svelte";
	import cookie from "cookiejs"

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
			localStorage.setItem("token", result.data.token);
			localStorage.setItem("expires", result.data.expires);
			window.location.href = "/user";
		}
	}
</script>

<div
	class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[350px] w-[100%] p-4"
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<span>Username</span>
			<input
				type="text"
				placeholder="YourUsername"
				bind:value={username}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span>Password</span>
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
