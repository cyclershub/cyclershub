<script lang="ts">
	export let src: string;
	export let heading: string;
	export let subheading: string;
	export let href: string;

</script>

<a class="w-full aspect-square group relative cursor-pointer" {href}>
	<img src={src} class="w-full h-full object-cover group-hover:brightness-50 transition-all" alt="">
	<div class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] invisible group-hover:visible text-center">
		<h2 class="uppercase text-white">{heading}</h2>
		<span class="text-white uppercase text-base">{subheading}</span>
	</div>
</a>