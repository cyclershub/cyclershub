import L, { LatLng, LayerGroup, Icon, Layer } from 'leaflet';

export const ClusterGroup = L.LayerGroup.extend({
	initialize: function(options) {
			L.LayerGroup.prototype.initialize.call(this, options);
			this._markerClusterRadius = options.clusterRadius || 80;
	},

	addLayer: function(layer) {
			var nearest = this._findNearestCluster(layer, this._markerClusterRadius);

			if (nearest) {
					nearest.clusteredMarkers.push(layer);
					nearest.updateIcon();
			} else {
					var newCluster = new L.Marker(layer.getLatLng(), {
							icon: new L.DivIcon({
									html: '<div><span>1</span></div>',
									className: 'marker-cluster'
							})
					});
					
					newCluster.clusteredMarkers = [layer];
					newCluster.updateIcon = function() {
							this.setIcon(new L.DivIcon({
									html: '<div><span>' + this.clusteredMarkers.length + '</span></div>',
									className: 'marker-cluster'
							}));
					};

					L.LayerGroup.prototype.addLayer.call(this, newCluster);
			}
	},

	_findNearestCluster: function(marker, maxDistance) {
			var latlng = marker.getLatLng();
			var clusters = this._layers;

			for (var id in clusters) {
					var cluster = clusters[id];
					var center = cluster.getLatLng();
					var distance = center.distanceTo(latlng);

					if (distance <= maxDistance) {
							return cluster;
					}
			}
			return null;
	}
});