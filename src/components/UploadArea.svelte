<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function onUpload(files: File[]) {
		dispatch("upload", {files});
	}

	function dropHandler(ev) {
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();

		let files: File[] = []

		if (ev.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			[...ev.dataTransfer.items].forEach((item, i) => {
				// If dropped items aren't files, reject them
				if (item.kind === "file") {
					const file = item.getAsFile();
					files.push(file)
				}
			});
		} else {
			// Use DataTransfer interface to access the file(s)
			[...ev.dataTransfer.files].forEach((file, i) => {
				files.push(file)
			});
		}

		if (files.length > 0) {
			onUpload(files)
		}

		isBeingDraggedOver = false;
	}

	let isBeingDraggedOver = false;

	function onDragOver(ev: DragEvent) {
		ev.preventDefault();

		isBeingDraggedOver = true;
	}

	function onDragLeave(ev: DragEvent) {
		ev.preventDefault();

		isBeingDraggedOver = false;
	}

	let input: HTMLInputElement;
</script>

<div
	on:click={() => input.click()}
	on:keydown={() => input.click()}
	class="border-2 select-none cursor-pointer border-stone-200 min-h-[100px] flex justify-center items-center text-center"
	on:drop={dropHandler}
	on:dragover={onDragOver}
	on:dragleave={onDragLeave}
	class:border-dashed={isBeingDraggedOver}>
	<slot />
	<input
		type="file"
		multiple
		bind:this={input}
		on:change={(ev) => {
			ev.preventDefault();
			if (!input.files) {
				return;
			}

			onUpload([...input.files]);
		}}
		style="display: none;" />
</div>
