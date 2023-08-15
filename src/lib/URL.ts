export function convertToUrlSafe(input: string): string {
	return input.toLowerCase().replace(/\s+/g, "-");
}