import type { APIRoute } from "astro";
import NodeGeocoder from "node-geocoder";

export const get: APIRoute = async ({ url }) => {
	const query = url.searchParams.get("query");
	if (!query) {
		return new Response(JSON.stringify({
			code: 405,
			type: "error",
			errors: ["Missing 'query' in request."]
		}))
	}

	const geocoder = NodeGeocoder({
		provider: "google",
		apiKey: "AIzaSyAzg-Lkvux9YWAZjocgBYjt-tRbSH0m1xI"
	})

	const result = await geocoder.geocode(query);

	return new Response(JSON.stringify({
		type: "success",
		code: 200,
		data: result[0]
	}));
}