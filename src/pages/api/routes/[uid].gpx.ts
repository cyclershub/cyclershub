import type { APIRoute } from "astro";
import { ApiRouteError } from "~/lib/ApiRouteError";
import { db } from "~/lib/shared";
import { isValidUUID } from "~/lib/uuid";
import { ApiRouteSuccess } from "~/lib/ApiRouteSuccess";
import { eGPXDecode, jsonToXML } from "egpx-parser";
import type { eGPX } from "egpx-parser/types/v1.1/eGPX";

export const get: APIRoute = async ({ request, params }) => {
	const uid = params.uid;

	if (!uid || !isValidUUID(uid)) {
		return ApiRouteError(["Missing uid"]);
	}

	const route = await db("routes").where({ uid }).first();

	if (!route) {
		return ApiRouteError(["Route not found"]);
	}

	let xml: string;
	try {
		let decoded = eGPXDecode(route.data);
		xml = jsonToXML(decoded, {
			xmlns: "http://www.topografix.com/GPX/1/1",
			"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
		});
	} catch(e) {
		return ApiRouteError(["Couldn't decode the data. Currently supported versions are https://www.topografix.com/GPX/1/1/."]);
	}

	if (!xml) {
		return ApiRouteError(["Couldn't decode the data. Currently supported versions are https://www.topografix.com/GPX/1/1/."]);
	}

	return ApiRouteSuccess({
		xml: xml,
		name: route.name,
		uid: route.uid
	})
}