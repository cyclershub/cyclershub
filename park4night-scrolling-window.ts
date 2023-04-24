import * as fs from "fs";

let last = [];

try {
	last = JSON.parse(fs.readFileSync("./park4night-result.json", "utf-8")) || [];
} catch(e) {

}

const map = new Map(last);

async function fetchWindow(lat: string, lng: string) {
	let response;
	try {
		response = await fetch(`https://park4night.com/api/places/around?lat=${lat}&lng=${lng}&radius=100&lang=en`);
	} catch(e) {
		console.log("Fetch failed! Resuming anyway!")
		return;
	}

	const json = await response.json();

	for (const place of json) {
		if (map.has(place.id)) {
			continue;
		}
		map.set(place.id, place);
	}
}

for (let i = 35; i < 55; i++) {
	for (let j = -4; j < 57; j++) {
		await fetchWindow(`${i}.0000000`, `${j}.0000000`);
		fs.writeFileSync("./park4night-result.json", JSON.stringify(Array.from(map.values())))
		console.log(`Scrolling Window at: ${i}, ${j}`)
	}
}