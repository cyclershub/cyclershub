import { CanvasLayer, IViewInfo } from "leaflet-canvas-layer";
import type { Place } from "../Places";
import type { LayerOptions } from "leaflet";

const TypeCache = new Map<string, HTMLImageElement>();

export class IconCanvasLayer extends CanvasLayer {
	private places: Map<
		Symbol,
		{
			img: HTMLImageElement;
			poi: Place;
		}
	> = new Map();
	private renderable: {
		img: HTMLImageElement;
		poi: Place;
	}[] = [];

	public constructor(public options: { sparse: number } & LayerOptions) {
		super(options);
	}

	public async addPlace(poi: Place): Promise<Symbol> {
		return new Promise((resolve, reject) => {
			if (TypeCache.has(poi.type)) {
				let img = TypeCache.get(poi.type) as HTMLImageElement;
				const symbol = Symbol();

				this.places.set(symbol, {
					img,
					poi,
				});

				this.needRedraw();

				resolve(symbol);
			} else {
				let img = new Image();
				img.onload = () => {
					TypeCache.set(poi.type, img);
					const symbol = Symbol();

					this.places.set(symbol, {
						img,
						poi,
					});

					this.needRedraw();

					resolve(symbol);
				};

				img.src = `/icons/${poi.type}.svg`;
			}
		});
	}

	private sortPlacesIntoBuckets(info: IViewInfo) {
		this.renderable = [];
		// Sort the points based on their longitude and latitude
		const sortedPoints = Array.from(this.places).filter((place) => {
			return info.bounds.contains([place[1].poi.lat, place[1].poi.lng]);
		});

		// Calculate the number of grid cells
		let gridSize = Math.ceil(1 / (this.options.sparse || 1));
		const numGridCells = gridSize ** 2;

		// Calculate the number of points to be rendered per grid cell
		const numPointsPerCell = Math.ceil(
			(sortedPoints.length * ((this.options.sparse || 1) / 1)) / numGridCells
		);

		// Create the grid cells
		const gridCells = new Array(numGridCells);
		for (let i = 0; i < numGridCells; i++) {
			gridCells[i] = [];
		}

		// Assign points to grid cells
		sortedPoints.forEach((point) => {
			const rangeX =
				info.bounds.getNorthEast().lng - info.bounds.getSouthWest().lng;
			const adjustedX = info.bounds.getNorthEast().lng - point[1].poi.lng;
			const cellX = Math.floor(normalize(adjustedX, 0, rangeX) * gridSize);

			const rangeY =
				info.bounds.getNorthEast().lat - info.bounds.getSouthWest().lat;
			const adjustedY = info.bounds.getNorthEast().lat - point[1].poi.lat;
			const cellY = Math.floor(normalize(adjustedY, 0, rangeY) * gridSize);

			const cellIndex = cellY * gridSize + cellX;

			gridCells[cellIndex].push(point);
		});

		// Randomly select the points from each grid cell
		gridCells.forEach((cell) => {
			for (let i = 0; i < numPointsPerCell; i++) {
				if (cell.length === 0) {
					break;
				}
				const randomIndex = Math.floor(Math.random() * cell.length);
				const selectedPoint = cell.splice(randomIndex, 1)[0];
				this.renderable.push(selectedPoint[1]);
			}
		});
	}

	public async addCustomIcon(type: string, latlng: L.LatLng): Promise<Symbol> {
		return new Promise((resolve, reject) => {
			const img = new Image();

			img.onload = () => {
				const symbol = Symbol();

				this.places.set(symbol, {
					img,
					poi: {
						lat: latlng.lat,
						lng: latlng.lng,
					} as Place,
				});

				this.needRedraw();

				resolve(symbol);
			};

			img.src = `/icons/${type}.svg`;
		});
	}

	public removePlace(symbol: Symbol) {
		this.places.delete(symbol);
		this.needRedraw();
	}

	public onDrawLayer(info: IViewInfo) {
		var ctx = info.canvas.getContext("2d");

		if (!ctx) {
			return false;
		}

		ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);

		this.sortPlacesIntoBuckets(info);
		for (const [symbol, { img, poi }] of Array.from(this.places)) {
			if (info.bounds.contains([poi.lat, poi.lng])) {
				const { x, y } = info.layer.map.latLngToContainerPoint({
					lat: poi.lat,
					lng: poi.lng,
				});

				ctx.drawImage(img, x - 14, y - 38, 28, 38);
			}
		}
	}
}

function normalize(value: number, min: number, max: number) {
	return (value - min) / (max - min);
}
