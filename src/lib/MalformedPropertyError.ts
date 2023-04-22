import { ApiRouteError } from "./ApiRouteError";

export function MalformedPropertyError(property: string) {
	return ApiRouteError([`Malformed property '${property}' in request body.`]);
}