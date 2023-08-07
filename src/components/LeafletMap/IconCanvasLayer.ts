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

	public constructor(public options: LayerOptions = {}) {
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

		//this.sortPlacesIntoBuckets(info);
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
