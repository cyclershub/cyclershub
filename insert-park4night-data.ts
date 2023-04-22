import * as fs from "fs";
import knex from "knex";

const db = knex({
	client: "pg",
	connection: {
		host: "localhost",
		port: 5436,
		user: "main",
		password: "jz@K5HWe%WMKJVhS",
		database: "main",
	},
});

const places = JSON.parse(fs.readFileSync("./park4night-result.json", "utf-8"));

await db("Places").insert(
	places.map((place: any) => {
		return {
			title: place.title_short || "",
			description: place.description,
			street: place.address.street,
			zip: place.address.zipcode,
			city: place.address.city,
			lat: place.lat,
			lng: place.lng,
			rating: place.rating,
			images: JSON.stringify(place.images),
			type: place.type.code,
		};
	})
);
