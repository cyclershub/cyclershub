<script lang="ts">
	import Logo from "./Icons/Logo.svelte";
</script>

<footer
	class="items-center flex flex-col gap-4 border-t bg-stone-100 py-16 px-8">
	<div
		class="mx-auto w-full h-full gap-8 max-w-[1440px] flex flex-col items-center">
		<p class="font-semibold text-center text-base max-w-[1000px]">
			The CyclersHub is dedicated to exploration by bicycle. We inspire and
			inform through original bikepacking routes, stories, and coverage of the
			gear, news, and events that make our community thrive. We believe travel
			by bicycle has the power to encourage conservation, inclusivity, and
			respect for all people and cultures. <a href="">More here</a>.
		</p>
		<Logo width={120} height={60}></Logo>	
		<div class="flex flex-row gap-8">
			<a href=""></a>
			<a href=""></a>
			<a href=""></a>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
			<div class="text-center">
				<h3>Where To Start</h3>
				<a href="">Bicycle Touring 101</a>
				<a href="">Guide To Cycle Touring Bags</a>
				<a href="">Overnighter 101</a>
				<a href="">Advice for Newbies</a>
				<a href="">Touring Routes</a>
				<a href="">Cycle Touring Content Creators</a>
			</div>
			<div class="text-center">
				<h3>Gear</h3>
				<a href="">Cycle Touring Gear List</a>
				<a href="">Gear That Lasts</a>
				<a href="">Bikepacking</a>
				<a href="">Bag Reviews</a>
				<a href="">Repair Guides</a>
				<a href="">Buyers Advice</a>
			</div>
			<div class="text-center">
				<h3>Recommended Reading</h3>
				<a href="">Freedom</a>
				<a href="">Leave No Trace</a>
				<a href=""></a>
				<a href=""></a>
				<a href=""></a>
				<a href=""></a>
			</div>
			<div class="text-center">
				<h3>About Us</h3>
				<a href="/about">About The CyclersHub</a>
				<a href="">Contact Us</a>
				<a href="">Suggest</a>
				<a href="">Share Your Route</a>
				<a href="">CyclersHub Login</a>
				<a href="">Support Us</a>
				<a href="/docs">For Developers</a>
			</div>
		</div>
	</div>
</footer>

<style lang="scss">
	footer h3 {
		@apply uppercase mb-4 font-semibold text-base text-stone-800;
	}

	footer .grid a {
		@apply uppercase font-semibold text-xs block mb-2 text-stone-600 transition-colors;

		&:hover {
			@apply text-stone-400;
		}
	}

	footer p {
		@apply text-stone-700;
	}

	footer p a {
		@apply underline;

		&:hover {
			@apply text-stone-500;
		}
	}
</style>
