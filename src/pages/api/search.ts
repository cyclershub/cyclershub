import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { db } from "~/lib/shared";

const PlaceQueryValidator = z.object({
	lat: z.number(),
	lng: z.number(),
	radius: z.number().max(200).int().optional().default(50),
	limit: z.number().max(50).int().optional().default(25),
	query: z.string()
})

export const post: APIRoute = async ({ request }) => {
	const body: z.infer<typeof PlaceQueryValidator> = await request.json();

	const validate = PlaceQueryValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues);
	}


	const result = await db.raw(`SELECT *
	FROM (
		SELECT *, haversine(lat, lng, ?, ?) AS distance 
		FROM places 
	) AS subquery
	WHERE distance <= ?
	AND title LIKE ?
	ORDER BY distance ASC 
	LIMIT ?`, [body.lat, body.lng, Math.round(body.radius), `%${body.query}%`, body.limit]);

	return ApiRouteSuccess(result.rows);
}