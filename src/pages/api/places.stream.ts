import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { db } from "~/lib/shared";

const PlaceSearchValidator = z.object({
	limit: z.number().max(250000).int().optional().default(10000),
	lat: z.number().min(-90).max(90),
	lng: z.number().min(-180).max(180),
	radius: z.number().min(0).max(250000).optional().default(500)
})

export const post: APIRoute = async ({ request }) => {
	const body: z.infer<typeof PlaceSearchValidator> = await request.json();

	const validate = PlaceSearchValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}


	const result = await db.raw(`SELECT id, lat, lng, type
	FROM (
		SELECT *, haversine(lat, lng, ?, ?) AS distance 
		FROM places 
	) AS subquery
	WHERE distance <= ?
	ORDER BY distance ASC 
	LIMIT ?`, [body.lat, body.lng, body.radius, body.limit]);

	// Encode the places to a bitstream with following encoding:
	// 16 bits for lat
	// 16 bits for lng
	// 8 bits for type
	// 32 bits for id

	let bl = 9;
	const stream = Buffer.alloc(result.rows.length * bl);

	for (let i = 0; i < result.rows.length; i++) {
		const place = result.rows[i];
		// Convert latitude and longitude to precision 2 and convert them to integer
		// Since latitude and longitude might have a minus we must remove that and map them to a circle of 360 degrees
		// This is done by adding 180 to the value
		let lat = Math.round((place.lat + 90) * 100);
		let lng = Math.round((place.lng  + 180) * 100);

		stream.writeUInt16BE(lat, i * bl);
		stream.writeUInt16BE(lng, i * bl + 2);
		stream.writeUInt32BE(place.id, i * bl + 4);
		stream.writeUint8(0, i * bl + 8);
		
	}
	

	return new Response(JSON.stringify({
		type: "success",
		code: 200,
		data: stream.toString("base64")
	}));
}