import { db } from "../shared";
import { UserRegisterValidator, UserType, UserTypeValidator } from "./types";
import { v4 as uuid } from "uuid";
import { hashPassword } from "../Password";


export class User {
	/**
	 * Sucht einen Nutzer in der Datenbank anhand seiner Public/Unique id und gibt ihn zurück.
	 * @param uid Die unique/public id des gesuchten Benutzers.
	 * @returns {UserType | null} Die Daten des Nutzers oder null falls dieser nicht gefunden werden kann.
	 */
	public static async fromPublicId(uid: string): Promise<UserType | null> {
		if (!uid || typeof uid !== "string") {
			return null;
		}

		const user = await db<UserType>("Users").select("*").where("uid", uid).first();

		if (!user) {
			return null;
		}

		return user;
	}

	public static async fromEmail(email: string): Promise<UserType | null> {
		if (!email || typeof email !== "string") {
			return null;
		}

		const user = await db<UserType>("Users").select("*").where("email", email).first();

		if (!user) {
			return null;
		}

		return user;
	}

	public static async fromUsername(username: string): Promise<UserType | null> {
		if (!username || typeof username !== "string") {
			return null;
		}

		const user = await db<UserType>("Users").select("*").where("username", username).first();

		if (!user) {
			return null;
		}

		return user;
	}

	/**
	 * Sucht einen Nutzer in der Datenbank anhand seiner Private id und gibt ihn zurück.
	 * @param uid Die private id des gesuchten Benutzers.
	 * @returns {UserType | null} Die Daten des Nutzers oder null falls dieser nicht gefunden werden kann.
	 */
	public static async fromPrivateId(id: number): Promise<UserType | null> {
		if (!id || typeof id !== "number") {
			return null;
		}

		const user = await db<UserType>("Users").select("*").where("id", id).first();

		if (!user) {
			return null;
		}

		return user;
	}

	public static async create(user: UserType): Promise<{uid: string, id: number} | null> {
		if (!user || UserRegisterValidator.safeParse(user).success == false) {
			return null;
		}

		const uid = uuid();
		const hashedPassword = hashPassword(user.password);

		const result = await db<UserType>("Users").insert({
			username: user.username,
			email: user.email,
			password: hashedPassword,
			uid: uid
		}, ["id"])

		if (!result) {
			return null;
		}

		return {
			uid,
			id: result[0].id
		}
	}
}