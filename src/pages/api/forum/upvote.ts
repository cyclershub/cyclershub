import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";

const VoteValidator = z.object({
	message_uid: z.string()
})

enum VoteType {
	UPVOTE = 1,
	DOWNVOTE = 0
}

export const post: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = VoteValidator.safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const user = await getUser({ cookies });

	if (!user) {
		return ApiRouteError(["User is not logged in."]);
	}

	// Get the message
	const message = await db("messages").select("*").where("uid", body.message_uid).first();

	if (!message) {
		return ApiRouteError(["Requested message does not exist."]);
	}

	const vote = await db("message_votes").select("*").where("users_id", user.id).andWhere("messages_id", message.id).first();

	let voted = false;
	if (vote && vote.type == VoteType.DOWNVOTE) {
		// Change the vote type and update the vote counter.
		await db("message_votes").delete().where("users_id", user.id).andWhere("messages_id", message.id);
		await db("messages").increment("votes", 1).where("id", message.id);
		message.votes++;
		voted = true;
	} else if (!vote) {
		await db("message_votes").insert({
			messages_id: message.id,
			users_id: user.id,
			type: VoteType.UPVOTE
		});

		await db("messages").increment("votes", 1).where("id", message.id);
		message.votes++;
		voted = true;
	}

	return ApiRouteSuccess({ votes: message.votes, voted });
}
