export interface Thread {
	id: string;
	votes: number;
	view_count: number;
	message_count: number;
	created_on: string;
	forums_id: string;
	users_id: string;
	tags: string[];
	title: string;
	uid: string;
}

export interface Message {
	id: number;
	uid: string;
	body: string;
	votes: number;
	created_on: number;
	threads_id: number;
	users_id: number;
}

export interface User {
	id: number;
	username: string;
	profile_picture: string | null;
	email: string;
	password: string;
	uid: string;
}