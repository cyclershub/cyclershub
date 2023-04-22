export interface Place {
	title: string;
	lat: number;
	lng: number;
	street: string;
	zipcode: string;
	city: string;
	country: string;
	description: string;
	CreatedOn: string;
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