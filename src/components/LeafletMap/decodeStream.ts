export function decodeStream(stream: string) {
	// Convert the received data into a Uint8Array
	const uint8Array = new Uint8Array(stream.length);
	for (let i = 0; i < stream.length; i++) {
		uint8Array[i] = stream.charCodeAt(i);
	}

	// Byte Length
	let bl = 9;
	// Decode the places
	const numPlaces = uint8Array.length / bl;
	const decodedPlaces = [];

	for (let i = 0; i < numPlaces; i++) {
		const lat =
			int16BEToFloat(uint8Array[i * bl], uint8Array[i * bl + 1]) / 100 - 90;
		const lng =
			int16BEToFloat(uint8Array[i * bl + 2], uint8Array[i * bl + 3]) / 100 -
			180;
		const id = int32BEToFloat(
			uint8Array[i * bl + 4],
			uint8Array[i * bl + 5],
			uint8Array[i * bl + 6],
			uint8Array[i * bl + 7]
		);
		const type = uint8Array[i * bl + 8];

		decodedPlaces.push({ lat, lng, type: "P", id });
	}
	return decodedPlaces;
}

function int32BEToFloat(
	byte1: number,
	byte2: number,
	byte3: number,
	byte4: number
) {
	const int32 = (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;
	return int32;
}

// Helper function to convert 16-bit signed integer to floating-point number
function int16BEToFloat(byte1: number, byte2: number) {
	const int16 = (byte1 << 8) | byte2;
	return int16;
}
