<script lang="ts">
	import AspectRatio from "../Icons/AspectRatio.svelte";
	import Container from "../Icons/Container.svelte";
	import Image from "../Icons/Image.svelte";
	import Plus from "../Icons/Plus.svelte";
	import Section from "../Icons/Section.svelte";

	let showAddDropout = false;

	interface PartTypeImage {
		type: "image",
		metadata: {
			src: string;
			alt: string;
			caption: string;
			configuration: "span" | "center" | "combine";
		}
	}

	type Part = PartTypeImage | { type: "text", metadata: {}, content: ""} | { type: "heading", metadata: {}, content: ""};

	let parts: Part[] = [];

	let highlightedPart = 0;

	function handleKeydown(event: KeyboardEvent) {
		// Add a new part if the user presses enter
		if (event.key === "Enter") {
			event.preventDefault();
			parts.push({
				content: "",
				type: "text",
				metadata: {},
			});
			parts = parts;
		} else if (
			event.key === "Backspace" &&
			parts.length > 0 &&
			parts[parts.length - 1].content === ""
		) {
			event.preventDefault();
			parts.pop();
			parts = parts;
		}
	}

	function showTooltip(i: number) {
		highlightedPart = i;
	}
</script>

<div class="max-w-[1000px] w-full mx-auto">
	{#each parts as part, i}
		{#if part.type === "text"}
			<p>{part.content}</p>
		{:else if part.type === "image"}
			<div class="flex flex-col gap-2 items-center relative">
				<div
					class:hidden={highlightedPart != i}
					class="absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-100%] bg-stone-900 rounded-lg gap-4 flex flex-row px-4 py-2">
					<button
						
						on:click={() => (part.metadata.configuration = "center")}>
						<Container width={20} height={20} class="fill-stone-400" style={part.metadata.configuration == "center" ? "fill: white;" : ""}></Container>
					</button>
					<button
						
						on:click={() => (part.metadata.configuration = "span")}>
						<Section width={20} height={20} class="fill-stone-400" style={part.metadata.configuration == "span" ? "fill: white;" : ""}></Section>
					</button>
					<button
						
						on:click={() => (part.metadata.configuration = "combine")}>
						<AspectRatio width={20} height={20} class="fill-stone-400" style={part.metadata.configuration == "combine" ? "fill: white;" : ""}></AspectRatio>
					</button>
				</div>
				<img
					src={part.metadata.src}
					alt={part.metadata.alt}
					on:click={() => showTooltip(i)}
					class:span={part.metadata.configuration === "span"}
					class:border-4={highlightedPart == i}
					class="border-green-200 w-full" />
				{#if part.metadata.caption}
					<p>{part.metadata.caption}</p>
				{/if}
			</div>
		{:else if part.type === "heading"}
			<h1>{part.content}</h1>
		{/if}
	{/each}

	<div class="flex flex-row gap-4">
		<button
			on:click={() => {
				showAddDropout = !showAddDropout;
			}}
			class="relative">
			<Plus
				width={45}
				height={45}
				class="p-2 border rounded-full" />
			{#if showAddDropout}
				<div
					class="flex flex-row gap-2 rounded-xl absolute top-[50%] translate-y-[-50%] left-0 translate-x-[100%] bg-stone-900 text-stone-200 px-4 py-2">
					<button
						on:click={() => {
							parts.push({
								type: "image",
								metadata: {
									src: "/landscape-placeholder.svg",
									alt: "",
									caption: "",
									configuration: "center"
								},
							});
							parts = parts;
							showAddDropout = false;
						}}>
						<Image width={25} height={25} class="fill-stone-200"></Image>
					</button>
				</div>
			{/if}
		</button>
		<textarea
			placeholder={parts.length == 0 ? "Tell your story..." : ""}
			class="border-none"
			cols="0"
			rows="1"
			on:keydown={handleKeydown} />
	</div>
</div>

<style>
	textarea {
		resize: none;
		border: none;
		background-color: transparent;
	}

	textarea:focus,
	textarea:hover {
		outline: none;
		background-color: transparent;
	}

	img.span {
		width: 1440px;
		margin-left: -440px;
	}
</style>
