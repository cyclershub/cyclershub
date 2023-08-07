<span {...$$restProps}>
	<slot />
</span>

<style>
	span {
		width: auto;
		height: 30px;
		overflow: hidden;
		clip-path: polygon(100% 0, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
		@apply items-center flex justify-center text-xs font-semibold transition-all px-6;
		opacity: 100;
		margin: 0px auto;
		text-align: center;
		letter-spacing: 0.1em;
		line-height: 1em;
		text-transform: uppercase;
	}
</style>
