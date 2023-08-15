<script lang="ts">
	export let widths: number[];
	export let wide: boolean = false;
</script>

<div class:wide={wide} style={`grid-template-columns: ${widths.map(w => `${w}%`).join(" ")}`}>
	<slot></slot>
</div>


<style lang="scss">
	.wide {
		@apply gap-4 grid lg:w-[calc(1440px-16px)] lg:ml-[-352px] ;
	}

	:global(.wide img) {
		@apply w-full h-full object-cover;
	}

	@media (max-width: 1024px) {
		.wide {
			grid-template-columns: 1fr !important;
		}
}
</style>


