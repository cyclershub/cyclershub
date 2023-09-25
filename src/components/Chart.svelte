<script lang="ts">
	import Chart, { ChartData, ChartType } from "chart.js/auto";

	export let type: ChartType;
	export let data: ChartData<any>;
	export let width: string = "300px";
	export let height: string = "300px";
	import { onMount } from "svelte";

	let chartCanvas: HTMLCanvasElement;

	onMount(() => {
		let ctx = chartCanvas.getContext("2d");

		chartCanvas.width = 200;
		chartCanvas.height = 200;

		new Chart(ctx, {
			type,
			data,
			options: {
				responsive: true,
			},
		});
	});
</script>

<div style={`width: ${width}; height: ${height};`}>
	<canvas
	bind:this={chartCanvas} />
</div>
