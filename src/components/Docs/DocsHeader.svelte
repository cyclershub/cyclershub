<script lang="ts">
	import Notifications from "../Icons/Notifications.svelte";
	import Search from "../Icons/Search.svelte";
	import Logo from "../Icons/Logo.svelte";
	import { notifications, dismissNotification } from "../NotificationStore";
	import Close from "../Icons/Close.svelte";

	let subActive: number = 1;
	let isScrollingDown = false;
	let lastScrollY = 0;

	let showNotifications = false;

	notifications.subscribe(() => {
		showNotifications = $notifications.length > 0;
	})

</script>

<svelte:window on:scroll={() => {
	// Show the header if the scroll direction is up
	isScrollingDown = window.scrollY > lastScrollY;
	lastScrollY = window.scrollY;
}}></svelte:window>

<header class="h-[60px] items-center border-b bg-stone-100 sticky top-0 z-50 transition-transform" class:translate-away={
	lastScrollY > 250 && isScrollingDown
}>
	<div
		class="mx-auto w-full px-4 md:px-0 flex flex-row h-full justify-center items-center relative max-w-[1440px]">
		<div class="nav gap-2 h-full menu hidden lg:flex justify-self-center">
			<a on:mouseenter={() => subActive = 1} href="/reviews">Docs</a>
			<a on:mouseenter={() => subActive = 2} href="/pedalpoint/map">Tutorial</a>
			<a on:mouseenter={() => subActive = 3} href="/gallery">API</a>
			<a on:mouseenter={() => subActive = 3} href="/gallery">Accounts</a>
			<a on:mouseenter={() => subActive = 3} href="/gallery">Testing</a>
		</div>
		<div class="subnav absolute top-[calc(100%+1px)] px-64 py-16 z-10 w-full">
			<div class="sub" class:on={subActive == 1}>
				<div class="grid grid-cols-4 gap-8">
					<div>
						<h2>INSPIRATION</h2>
						<a href="">View Latest/All</a>
						<a href="">Videos</a>
						<a href="">Your Stories</a>
						<a href="">Culture</a>
						<h3>Popular Tags</h3>
						<a href="">#bikecrafting</a>
						<a href="">#Tour-Divide</a>
						<a href="">#winter-bikepacking</a>
					</div>
					<div>
						<h2>GEAR/REVIEWS</h2>
						<a href="/reviews/category/all">View Latest/All</a>
						<a href="/reviews/category/bags">Bags/Panniers</a>
						<a href="/reviews/category/components">Components</a>
						<a href="/reviews/category/gear">Camping Gear</a>
						<a href="/reviews/category/accessories">Accessories</a>
						<a href="/reviews/category/clothing">Clothing</a>
					</div>
					<div>
						<h2>Reviews</h2>
						<a href="/reviews/category/hardtail">Hardtails</a>
						<a href="/reviews/category/gravel">Drop-Bar & Gravel</a>
						<a href="/reviews/category/full-suspension">Full Suspension</a>
						<a href="/reviews/category/fat-bike">Fat Bikes</a>
						<h3>Brands & Companies</h3>
						<a href="/brands">View All</a>
					</div>
					<div>
						<h2>PLAN YOUR TRIP</h2>
						<a href="">View Latest/All</a>
					</div>
				</div>
			</div>
			<div class="sub" class:on={subActive == 2}>
				<div class="grid grid-cols-4 gap-8">
					<div>
						<h2>Where to Begin</h2>
						<p>We have over 300 original and curated bikepacking routes in our global network spanning nearly 50 countries.</p>
						<img src="/images/bikepacking-routes-map_0.jpg" alt="Bikepacking Routes Map">
						<p>Start at our <a href="/pedalpoint/map" class="inline">worldwide routes map</a> to dig into our detailed guides with GPS maps and inspiring photography.</p>
					</div>
					<div>
						<h2>By Location</h2>
						<a href="">Europe</a>
						<a href="">Middle East</a>
						<a href="">Canada</a>
						<a href="">The United States</a>
						<a href="">Latin America</a>
						<a href="">Asia</a>
						<a href="">Africa</a>
						<a href="">Oceania</a>
					</div>
					<div>
						<h2>By Type</h2>
						<a href="" class="image-link">
							<img src="/images/types/singletrack.png" width="60px">
							Singletrack
						</a>
						<a href="" class="image-link">
							<img src="/images/types/gravel.png" width="60px">
							Gravel/All-Road
						</a>
						<a href="" class="image-link">
							<img src="/images/types/dirt-road.png" width="60px">
							Dirt-Road Touring
						</a>
						<a href="" class="image-link">
							<img src="/images/types/fat-bike.png" width="60px">
							Fat-Bike
						</a>
					</div>
					<div>
						<h2>By Length (Days)</h2>
						<a href="">Overnighters</a>
						<a href="">Weekend Routes (2-4)</a>
						<a href="">Week Long Routes (5-10)</a>
						<a href="">Odysseys (11-30)</a>
						<a href="">"Freakouts" (31+)</a>
						<h3>Camping Spots</h3>
						<p>Discover the <a href="/pedalpoint/map" class="inline">Global Wild Camping Project</a> — an initiative to map hidden camping spots worldwide. Join our community of nature enthusiasts and find untouched wilderness for unforgettable adventures</p>
					</div>
				</div>
			</div>
			<div class="sub" class:on={subActive == 3}>
				<p>The <a href="/gallery" class="inline">Gallery</a> is the ultimate showcase for bicycle enthusiasts! This innovative project provides a platform for users to proudly display their beloved bicycles, whether they are sleek road bikes, rugged mountain bikes, vintage classics, or anything in between. Join our passionate community, where members can share their two-wheeled companions, exchange stories, and admire each other's rides. </p>
				<div class="flex flex-row gap-8">
					<div class="w-full">
						<img src="/images/setups/2.jpg" alt="" class="h-[200px] object-cover w-full">
						<p class="bg-stone-900 text-white font-medium px-4 py-4 h-[120px]">symbol half sent outside vapor appropriate universe shallow traffic labor degree recent short win drawn grow log accurate name apartment group blow origin surprise</p>
					</div>
					<div class="w-full">
						<img src="/images/setups/3.jpg" alt="" class="h-[200px] object-cover w-full">
						<p class="bg-stone-900 text-white font-medium px-4 py-4 h-[120px]">it steady pitch open plenty change till vapor ready blue fought children knife origin wing potatoes species door meat tiny bill do heat crop</p>
					</div>
					<div class="w-full">
						<img src="/images/setups/5.jpg" alt="" class="h-[200px] object-cover w-full">
						<p class="bg-stone-900 text-white font-medium px-4 py-4 h-[120px]">bowl several serious function three doing throw weather cry something then cabin baby heading here cent saw station shall production fear tell though coat</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>

<style lang="scss">
	.menu a {
		@apply uppercase font-medium text-sm relative px-6 py-4 h-full flex items-center text-center;
	}

	.menu a::after {
		content: "";
		@apply absolute bottom-0 left-[50%] translate-x-[-50%] w-0 h-[2px] block bg-black transition-all duration-300;
	}

	.menu a:hover {
		@apply bg-gray-100;
	}

	.menu a:hover::after {
		@apply w-[100%];
	}

	.subnav {
		@apply opacity-0 hidden transition-opacity duration-300 bg-gray-100 text-center;

		&:hover {
			@apply opacity-100 block;
		}

		& h2 {
			@apply uppercase;
		}

		& h3 {
			@apply text-xl font-medium my-4 uppercase;
		}

		& p {
			@apply text-sm;
		}

		& a:not(.inline) {
			@apply text-sm font-medium block mb-2 uppercase text-gray-700 transition-colors;

			&:hover {
				@apply text-gray-400;
			}
		}

		& a.inline {
			@apply underline;
		}

		& .image-link {
			display: flex !important;
			@apply flex-col gap-2 items-center;
		}
	}

	.nav:has(a:nth-child(1):hover,a:nth-child(2):hover,a:nth-child(3):hover) + .subnav {
		@apply opacity-100 block;
	}

	.sub:not(.on) {
		@apply hidden;
	}

	.translate-away {
		@apply translate-y-[-100%];
	}
</style>
