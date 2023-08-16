<script lang="ts">
	import { onMount } from "svelte";
	import WaveSurfer from "wavesurfer.js";
	import Play from "../Icons/Play.svelte";
	import Pause from "../Icons/Pause.svelte";
	import Download from "../Icons/Download.svelte";
	import format from "format-duration";

	let container: HTMLDivElement;

	export let src: string;
	export let downloadable: boolean = true;

	let wavesurfer: WaveSurfer;
	onMount(() => {
		wavesurfer = WaveSurfer.create({
			container,
			waveColor: "#a8a29e",
			progressColor: "#78716c",
			url: src,
			height: 40,
		});

		wavesurfer.on("pause", () => playing = false)
		wavesurfer.on("play", () => playing = true)
		wavesurfer.on("timeupdate", () => currentMillis = wavesurfer.getCurrentTime() * 1000)
		wavesurfer.on("drag", (percentage) => currentMillis = wavesurfer.getDuration() * percentage * 1000)
		wavesurfer.on("ready", () => totalMillis = wavesurfer.getDuration() * 1000)
	});

	let playing = false;

	let currentMillis = 0;
	let totalMillis = 0;
</script>

<div class="border border-stone-200 w-full px-4 py-4 my-8">
	<slot></slot>
	<div class="flex items-center gap-4">
		<div class="flex gap-2">
			<button
			class="border border-stone-200 rounded-full p-2.5 cursor-pointer"
			on:click={() => {
				wavesurfer.playPause();
				wavesurfer = wavesurfer;
			}}>
			{#if playing}
				<Pause
					width={25}
					height={25}
					class="fill-stone-800" />
			{:else}
				<Play
					width={25}
					height={25}
					class="fill-stone-800" />
			{/if}
		</button>
		{#if downloadable}
		<button
		class="border border-stone-200 rounded-full p-2.5 cursor-pointer"
		on:click={() => {
			window.open(src, "_blank")
		}}>
		<Download width={25} height={25} class="fill-stone-800"></Download>
	</button>
		{/if}
		</div>
		<div bind:this={container} class="w-full h-[40px]" />
		<span class="flex flex-row justify-between"><span class="w-[40px] text-stone-400">{format(currentMillis)}</span><span class="w-[10px] text-stone-400">/</span><span class="w-[40px] text-stone-400">{format(totalMillis)}</span></span>
	</div>
	
</div>
