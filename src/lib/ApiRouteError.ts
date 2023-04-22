export function ApiRouteError(errors: string[]) {
	return new Response(JSON.stringify({
		success: false,
		errors
	}));
}