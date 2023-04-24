import knex, { Knex } from "knex";

export function dbOpen(): Knex {
	const db = knex({
		client: "pg",
		connection: {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		},
	});

	return db;
}

export const db = dbOpen();
