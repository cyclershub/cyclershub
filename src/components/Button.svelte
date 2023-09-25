<button
	on:click
	{...$$restProps}
>
	<slot />
</button>


<style>
	button {
		@apply bg-stone-200 w-min text-stone-600 font-semibold px-6 py-2 text-base rounded-lg rounded-bl-none transition-colors;
	}

	button:hover {
		@apply bg-stone-300;
	}
</style>