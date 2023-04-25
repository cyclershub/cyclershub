import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";

const ThreadValidator = z.object({
	title: z.string().min(10).max(250),
	description: z.string().min(50).max(15000),
	forum: z.string(),
	tags: z.array(z.string()).max(5).min(0)
})

export const put: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = ThreadValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const loggedIn = isLoggedIn({ cookies });
	const user = await getUser({ cookies });

	if (!user || !loggedIn) {
		return ApiRouteError(["User is not logged in."]);
	}

	// Check if the forum exists
	const forum = await db("forums").select("*").where("uid", body.forum).first();

	if (!forum) {
		return ApiRouteError(["Forum does not exist!"]);
	}

	const thread = await db("threads").insert({
		title: body.title,
		forums_id: forum.id,
		users_id: user.id
	}, "id");

	if (!thread || !thread[0].id) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	// Insert first message
	const message = await db("messages").insert({
		body: body.description,
		threads_id: thread[0].id,
		users_id: user.id
	}, "id")

	for (const tag of body.tags) {
		const result = await db("tags").insert({
			tag
		}).onConflict(["tag"]).ignore().returning("*");

		await db("threads_tags").insert({
			tags_id: result[0].id,
			threads_id: thread[0].id
		})
	}

	if (!message) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	return ApiRouteSuccess({ id: message[0].id });
}
