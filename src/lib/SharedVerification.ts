import type { AstroGlobal } from "astro";
import { decodeToken } from "./JsonWebToken";
import moment from "moment";
import { User } from "./User";

let user: any = null;

export async function isLoggedIn(astro: { cookies: AstroGlobal["cookies"] }) {
	if (astro.cookies.has("token")) {
		let result = decodeToken(astro.cookies.get("token").value as string);
	
		if (result && typeof result == "object") {
			let loggedIn = result.exp > moment().unix();

			user = await getUser(astro);

			if (!user) {
				return false;
			}

			return loggedIn;
		}
	}

	return false;
}



export async function getUser(astro: { cookies: AstroGlobal["cookies"] }) {
	if (user) {
		return user;
	}

	if (astro.cookies.has("token")) {
		let result = decodeToken(astro.cookies.get("token").value as string);
	
		if (result && typeof result == "object") {
			user = await User.fromPrivateId(result.id)

			if (!user) {
				return false;
			}
		}
	}

	return user;
}