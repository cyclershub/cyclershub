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

export const post: APIRoute = async ({ request }) => {
	const body: z.infer<typeof PlaceSearchValidator> = await request.json();

	const validate = PlaceSearchValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}


	const result = await db.raw(`SELECT *
	FROM (
		SELECT *, haversine(lat, lng, ?, ?) AS distance 
		FROM places 
	) AS subquery
	WHERE distance <= ?
	ORDER BY distance ASC 
	LIMIT ?`, [body.lat, body.lng, Math.round(body.radius), body.limit]);

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

	const id = await db("places").insert({
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
