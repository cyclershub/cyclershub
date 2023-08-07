import type { APIRoute } from "astro";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { db } from "~/lib/shared";
import * as fs from "fs";
import { isValidUUID } from "~/lib/uuid";

export const get: APIRoute = async ({ request, params }) => {
	const uid = params.uid;

	if (!uid || !isValidUUID(uid)) {
		return ApiRouteError(["Missing uid"]);
	}

	const image = await db("images").where({ uid }).first();

	if (!image) {
		return ApiRouteError(["Image not found"]);
	}

	const location = `/persistent/images/${image.uid}.png`;

	if (fs.existsSync(location) === false) {
		return new Response(null, {
			status: 404
		})
	}

	const data = fs.readFileSync(location);
	const response = new Response(data, {
		headers: {
			"Content-Type": "image/png"
		},
		status: 200
	})

	return response;
}