import {
	addNotification,
	updateNotification,
} from "~/components/NotificationStore";

export function* uploadImage(files: File[]) {
	let uploaded = 0;

	let notification = addNotification({
		type: "info",
		message: `${uploaded} of ${files.length} images uploaded, this might take a while...`,
		dismissible: true,
	});

	for (const file of files) {
		// Check the mime type if it's a valid image
		if (!file.type.startsWith("image/")) {
			continue;
		}

		const reader = new FileReader();

		reader.onload = async (e) => {
			const data = reader.result;

			const res = await fetch("/api/image.json", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					base64: data,
					alt: file.name || "Alt text",
					category: "user_submitted",
				}),
			});
			const json = await res.json();

			if (json.success === true) {
				uploaded++;
				updateNotification(notification, {
					message: `${uploaded} of ${files.length} images uploaded, we're getting there...`,
				});

				if (uploaded == files.length) {
					updateNotification(notification, {
						timeout: 3000,
					});
				}
			}
		};
		reader.readAsDataURL(file);
	}
}
