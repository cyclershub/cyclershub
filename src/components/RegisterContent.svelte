<script lang="ts">
	import Button from "./Button.svelte";

	let username: string;
	let email: string;
	let password: string;

	async function registerUser() {
		let result = await fetch("/api/user", {
			method: "PUT",
			body: JSON.stringify({
				username,
				email,
				password,
			}),
		}).then(r => r.json());

		if (result.success) {
			window.location.href = "/user/login";
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
			<span>Email</span>
			<input
				type="text"
				placeholder="your.email@email.com"
				bind:value={email}
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
			<Button on:click={registerUser}>Register</Button>
			<a href="/user/login">Login instead</a>
		</div>
	</div>
</div>
