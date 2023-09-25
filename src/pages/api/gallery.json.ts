import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";

const SetupValidator = z.object({
	title: z.string().min(10).max(150),
	body: z.string().min(150).max(2500),
	// A list of uids of already uploaded images
	images: z.array(z.string()).min(1)
})

export const put: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = SetupValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const loggedIn = isLoggedIn({ cookies });
	const user = await getUser({ cookies });

	if (!user || !loggedIn) {
		return ApiRouteError(["User is not logged in."]);
	}

	const result = await db("setups").insert({
		title: body.title,
		body: body.body,
		users_id: user.id
	}, ["id", "uid"]);

	if (!result) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	return ApiRouteSuccess({ uid: result[0].uid });
}
