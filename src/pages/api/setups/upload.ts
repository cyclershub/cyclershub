import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";

export const put: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = z.object({
		title: z.string().min(5).max(150),
		content: z.string(),
		cover: z.string()
	}).safeParse(body);
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
		content: body.content,
		users_id: user.id,
		cover: body.cover
	}, ["id", "uid"]);

	if (!result) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	return ApiRouteSuccess({ uid: result[0].uid });
}


export const post: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = z.object({
		title: z.string().min(0).max(150),
		content: z.string(),
		uid: z.string(),
		cover: z.string()
	}).safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const loggedIn = isLoggedIn({ cookies });
	const user = await getUser({ cookies });

	if (!user || !loggedIn) {
		return ApiRouteError(["User is not logged in."]);
	}

	const route = await db("setups").select("*").where({ uid: body.uid, users_id: user.id }).first();

	if (!route) {
		return ApiRouteError(["Route not found."]);
	}

	const result = await db("setups").update({
		title: body.title,
		content: body.content,
		cover: body.cover
	}, ["id", "uid"]).where({ uid: body.uid, users_id: user.id });

	if (!result) {
		return ApiRouteError(["Couldn't update. Something went wrong!"]);
	}

	return ApiRouteSuccess({ uid: result[0].uid });
}

export const get: APIRoute = async ({ request, cookies }) => {
	const body = await request.json();

	const validate = z.object({
		uid: z.string()
	}).safeParse(body);
	if (!validate.success) {
		return ApiRouteError(validate.error.issues.map(x => x.message));
	}

	const loggedIn = isLoggedIn({ cookies });
	const user = await getUser({ cookies });

	if (!user || !loggedIn) {
		return ApiRouteError(["User is not logged in."]);
	}

	const route = await db("setups").select("*").where({ uid: body.uid, users_id: user.id }).first();

	if (!route) {
		return ApiRouteError(["Route not found."]);
	}

	return ApiRouteSuccess({ uid: route.uid, title: route.title, content: route.content, created_on: route.created_on });
}
