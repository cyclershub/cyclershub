import { Writable, writable } from "svelte/store";

export interface NotificationType {
	id?: number,
	dismissible?: boolean;
	message?: string;
	timeout?: number;
	type?: "success" | "error" | "info";
}

export function addNotification(notification: NotificationType) {
	const id = Math.floor(Math.random() * 10000);

	const defaults: NotificationType = {
		dismissible: true,
		message: "",
		timeout: 2000,
		type: "success"
	};

	notification.id = id;

	notifications.update((all) => [{...defaults, ...notification}, ...all]);
	

	if (notification.timeout) {
		setTimeout(() => {
			dismissNotification(id);
		}, notification.timeout);
	}
	return id;
}

export function updateNotification(id: number, data: NotificationType) {
	notifications.update((all) => {
		const index = all.findIndex(x => x.id === id);
		if (index === -1) return all;
		all[index] = {...all[index], ...data};
		if (all[index].timeout) {
			setTimeout(() => {
				dismissNotification(id);
			}, all[index].timeout);
		}
		return all;
	})
}

export function dismissNotification(id: number) {
	notifications.update((all) => all.filter(x => x.id !== id))
}

export const notifications: Writable<NotificationType[]> = writable([]);