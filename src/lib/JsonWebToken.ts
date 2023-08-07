import jwt from "jwt-simple";

export function encodeToken(data: Record<string, any>) {
	const token = jwt.encode(data, "yIvbgS$k7Bfc+mpV%TWDZAhje9#uJad4", "HS256");
	return token;
}

export function decodeToken(token: string) {
	return jwt.decode(token, "yIvbgS$k7Bfc+mpV%TWDZAhje9#uJad4", true);
}