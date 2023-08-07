import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";
import sharp from "sharp";

const ImageValidator = z.object({
	alt: z.string().min(10).max(255),
	category: z.string().min(1).max(50),
	base64: z.string()
})

export const put: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = ImageValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const loggedIn = isLoggedIn({ cookies });
	const user = await getUser({ cookies });

	if (!user || !loggedIn) {
		return ApiRouteError(["User is not logged in."]);
	}

	const result = await db("images").insert({
		alt: body.alt,
		category: body.category,
		users_id: user.id
	}, ["id", "uid"]);

	if (!result) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	const location = `/persistent/images/${result[0].uid}.png`;

	// Write the image to disk
	const data = body.base64.split(";base64,").pop();
	const buffer = Buffer.from(data, "base64");

	// Compress the image using sharp
	await sharp(buffer).webp({ quality: 60 }).toFile(location);

	return ApiRouteSuccess({ uid: result[0].uid });
}
