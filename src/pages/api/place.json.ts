import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";

const PlaceSearchValidator = z.object({
	lat: z.number(),
	lng: z.number(),
	radius: z.number(),
	limit: z.number().max(250).int().optional().default(200)
})

export const get: APIRoute = async ({ request }) => {
	const query = new URL(request.url).searchParams;

	if (!query.has("id")) {
		return ApiRouteError(["Missing id"]);
	}

	const id = query.get("id");

	const place = await db("places").where("id", id).first();

	if (!place) {
		return ApiRouteError(["Place not found"]);
	}

	return ApiRouteSuccess(place);
}