import knex, { Knex } from "knex";

export function dbOpen(): Knex {
	const db = knex({
		client: "pg",
		connection: {
			host: process.env.DB_CONNECTION,
			port: Number(process.env.DB_PORT),
			user: "main",
			password: "jz@K5HWe%WMKJVhS",
			database: "main",
		},
	});

	return db;
}

export const db = dbOpen();
