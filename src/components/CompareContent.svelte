<script lang="ts">
	import { convertToUrlSafe } from "~/lib/URL";

	export let products = [null, null, null];

	const possibleProducts = [{
		uid: "9zNVj",
		name: "Desert Cargo Cage",
			brand: "State Bicycle",
			category: "Fork Cage",
			weight: 186,
			price: 24.99,
			image:
				"https://media.zenfs.com/en/bike_perfect_349/b1fd2b8228cd4c4a71f816ad5831339c",
		},
		{
			uid: "oXHrKbHfnTtg4",
			name: "Carry Cage",
			brand: "Restrap",
			category: "Fork Cage",
			weight: 136,
			price: 43.99,
			image:
				"https://restrap.com/cdn/shop/products/00_Carry_Cage_1000x.jpg?v=1640254381",
		},]

	function expandArrayToMinLength(arr: any[], minLength: number, value = null) {
		if (!Array.isArray(arr)) {
			throw new Error("Input is not an array");
		}

		if (arr.length >= minLength) {
			return arr;
		}

		const diff = minLength - arr.length;
		const expansion = new Array(diff).fill(value);

		return arr.concat(expansion);
	}
</script>

{#each expandArrayToMinLength(products, 3) as product, i}
	<div class="w-full flex flex-col gap-4">
		<select on:input={(event) => {
			products[i] = possibleProducts.find((p) => p.uid === event.target.value);
		}}>
			{#each possibleProducts as possibleProduct}
				<option value={possibleProduct.uid}>[{possibleProduct.brand}] {possibleProduct.name}</option>
			{/each}
		</select>
		{#if product}
			<div>
				<img
					src={product.image}
					class="w-full aspect-video object-cover"
					alt={product.name} />
				<span class="text-stone-600 font-bold text-xl mt-2 block">
					{product.name}
				</span>
				<a href="/brands/{convertToUrlSafe(product.brand)}">
					<span class="text-stone-500 underline text-sm">{product.brand}</span>
				</a>
				<table>
					<tr>
						<td>Category</td>
						<td>{product.category}</td>
					</tr>
					<tr class:higher={product.weight > products[i + 1]?.weight}>
						<td>Weight</td>
						<td>{product.weight}g</td>
					</tr>
					<tr class:higher={product.price > products[i + 1]?.price}>
						<td>Price</td>
						<td>{product.price}</td>
					</tr>
				</table>
			</div>
		{/if}
	</div>
{/each}

<style lang="scss">
	table {
		width: 100%;
	}

	table td:last-child {
		text-align: right;
		@apply font-semibold;
	}

	table td {
		@apply text-stone-800 border px-2 py-2;
	}

	table tr {
		@apply relative;

		&::after {
			content: "<";
			@apply absolute top-[50%] left-[calc(100%+12px)] translate-y-[-50%] font-bold text-stone-500;
		}

		&.higher::after {
			content: ">";
		}
	}
</style>
