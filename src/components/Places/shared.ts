import { Writable, writable } from "svelte/store";
import type { Place } from "./Place";

export let placesVisible: Writable<Place[]> = writable<Place[]>([]);
export let latitude: Writable<number> = writable(0);
export let longitude: Writable<number> = writable(0);

export const showMultiplePlaces = (places: Place[]) => {
	placesVisible.set(places);
};

export const showSinglePlace = (place: Place) => {
	placesVisible.set([place]);
	latitude.set(place.lat);
	longitude.set(place.lng);
};

export const hideAllPlaces = () => {
	placesVisible.set([]);
};