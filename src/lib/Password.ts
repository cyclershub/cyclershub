import * as crypto from "crypto";

export function hashPassword(password: string): string {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = hashWithGivenSalt(password, salt) + salt;
	return hash;
}

export function hashWithGivenSalt(password: string, salt: string): string {
	const hash = crypto.scryptSync(password, salt, 32).toString("hex");
	return hash;
}

export function validatePassword(known: string, unknown: string): boolean {
	const salt = known.slice(64);
	const originalPasswordHash = known.slice(0, 64);
	const currentPasswordHash = hashWithGivenSalt(unknown, salt)
	return originalPasswordHash == currentPasswordHash;
}