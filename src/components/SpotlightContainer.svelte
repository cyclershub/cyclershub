<script lang="ts">
	import moment from "moment";

	export let title: string;
	export let date: Date;
	export let image: string;
	export let href: string;
</script>

<a class="group cursor-pointer" {href}>
	<span class="text-xs text-gray-500 font-semibold">{moment(date).format("MMM d")}</span>
	<div class="overflow-hidden">
		<img
			src={image}
			alt={title}
			class="group-hover:scale-105 aspect-video object-cover my-2 transition-transform w-full h-full"
		/>
	</div>
	<p class="uppercase font-semibold text-xs line">
		{title}
	</p>
</a>