import type { APIRoute } from "astro";
import { z } from "zod";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { getUser, isLoggedIn } from "~/lib/SharedVerification";
import { db } from "~/lib/shared";
import * as convert from "xml-js";
import { eGPXEncode } from "egpx-parser";
import type { eGPX } from "egpx-parser/types/v1.1/eGPX";

const ImageValidator = z.object({
	name: z.string().min(0).max(150),
	data: z.string(),
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

	// Try to encode the data to a buffer
	let binary: Uint8Array;
	try {
		let json = convert.xml2json(body.data, { compact: false, alwaysArray: true });
		binary = eGPXEncode(json as unknown as eGPX.File, "1.1");
		console.log(json)
	} catch(e) {
		return ApiRouteError(["Couldn't parse the data. Make sure it's a valid GPX file, currently supported versions are https://www.topografix.com/GPX/1/1/."]);
	}

	if (!binary) {
		return ApiRouteError(["Couldn't parse the data. Make sure it's a valid GPX file, currently supported versions are https://www.topografix.com/GPX/1/1/."]);
	}

	const result = await db("routes").insert({
		name: body.name,
		data: Buffer.from(binary),
		users_id: user.id
	}, ["id", "uid"]);

	if (!result) {
		return ApiRouteError(["Couldn't insert. Something went wrong!"]);
	}

	return ApiRouteSuccess({ uid: result[0].uid, buffer: binary });
}
