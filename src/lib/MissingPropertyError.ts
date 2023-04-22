import { ApiRouteError } from "./ApiRouteError";

export function MissingPropertyError(property: string) {
	return ApiRouteError([`Missing property '${property}' in request body.`]);
}