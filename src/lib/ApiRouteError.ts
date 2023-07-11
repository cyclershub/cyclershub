export function ApiRouteError(errors: any[]) {
	return new Response(JSON.stringify({
		success: false,
		errors
	}));
}