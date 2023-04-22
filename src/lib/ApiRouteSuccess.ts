export function ApiRouteSuccess(data: any) {
	return new Response(JSON.stringify({
		success: true,
		data
	}));
}