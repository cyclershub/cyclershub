import { createAsyncMemoizedFunction } from "./asyncMemoization";

async function getIconNaively(icon: string) {
	const { default: innerHTML } = await import(`../../public/icons/${icon}.svg?raw`);

	return innerHTML;
}

export const getIcon = createAsyncMemoizedFunction(getIconNaively);