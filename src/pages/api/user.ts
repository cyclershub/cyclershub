import type { APIRoute } from "astro";
import { User } from "../../lib/User";
import { UserRegisterValidator, UserType, UserTypeValidator } from "../../lib/User/types";
import { MissingPropertyError } from "../../lib/MissingPropertyError";
import { ApiRouteSuccess } from "../../lib/ApiRouteSuccess";
import { ApiRouteError } from "../../lib/ApiRouteError";

/**
 * Ruft einen Nutzer anhand seiner uid aus der Datenbank ab.
 * @param param0 Die Request mit dem request body. Dieser enthält entweder eine uid mit der der Benutzer identifiziert werden kann.
 */
export const get: APIRoute = async ({ request }) => {
	const body = await request.json();

	if (!body.hasOwnProperty("uid")) {
		return MissingPropertyError("uid");
	}

	const user = User.fromPublicId(body.uid);

	if (!user) {
		return ApiRouteError(["Missing entity."]);
	}

	return ApiRouteSuccess(user);
}

export const put: APIRoute = async ({ request }) => {
	const body = await request.json();

	const validate = UserRegisterValidator.safeParse(body);

	if (validate.success == false) {
		return ApiRouteError(["Failed to execute!"]);
	}

	const result = await User.create(body as UserType);

	if (!result) {
		return ApiRouteError(["Failed to execute!"]);
	}

	return ApiRouteSuccess({ uid: result.uid, id: result.id });
}

