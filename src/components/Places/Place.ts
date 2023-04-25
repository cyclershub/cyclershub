export interface Place {
	title: string;
	lat: number;
	lng: number;
	street: string;
	zip: string;
	city: string;
	country: string;
	description: string;
	created_on: string;
	distance: number;
	id: number;
	images: {
		id: number;
		thumb: string;
		url: string
	}[],
	photo: number;
	rating: number;
	review: number;
	services: string[],
	waiting_validation: boolean;
	type: string
}