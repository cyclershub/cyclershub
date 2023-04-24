import knex, { Knex } from "knex";

export function dbOpen(): Knex {
	const db = knex({
		client: "pg",
		connection: process.env.DB_CONNECTION,
	});

	return db;
}

export const db = dbOpen();
