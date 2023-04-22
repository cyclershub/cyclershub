import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";

export const get: APIRoute = async ({ url }) => {
	const lat = url.searchParams.get("lat");
	const lng = url.searchParams.get("lng");
	const radius = Number(url.searchParams.get("radius"));
	

	if (!lat || !lng || !radius) {
		return new Response(JSON.stringify({
			code: 405,
			type: "error",
			errors: ["Missing lat | lng | radius in request."]
		}))
	}

	if (radius > 200) {
		return ApiRouteError(["'radius' must be smaller than 200!"]);
	}

	const result = await db.raw(`SELECT *
	FROM (
		SELECT *, haversine(lat, lng, ?, ?) AS distance 
		FROM "Places" 
	) AS subquery
	WHERE distance <= ?
	ORDER BY distance ASC 
	LIMIT ?`, [lat, lng, radius, 500]);
	/* const result = await db("Places").select(db.raw("*, haversine(lat, lng, ?, ?) AS distance", [lat, lng])).where("distance", "<=", radius).orderBy("distance").limit(500); */

	/* const response = await fetch(`https://park4night.com/api/places/around?lat=${lat}&lng=${lng}&radius=200&lang=en`);

	const json = await response.json(); */

	return new Response(JSON.stringify({
		type: "success",
		code: 200,
		data: result.rows
	}));
}

const PlaceValidator = z.object({
	title: z.string().min(10).max(150),
	description: z.string().min(150).max(2500),
	lat: z.number(),
	lng: z.number(),
	type: z.string()
})

export const put: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = PlaceValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const loggedIn = isLoggedIn({ cookies });
	const user = await getUser({ cookies });

	if (!user || !loggedIn) {
		return ApiRouteError(["User is not logged in."]);
	}

	const id = await db("Places").insert({
		title: body.title,
		description: body.description,
		lat: body.lat,
		lng: body.lng,
		type: body.type,
		users_id: user.id
	}, "id");

	if (!id) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	return ApiRouteSuccess({ id: id[0].id });
}
