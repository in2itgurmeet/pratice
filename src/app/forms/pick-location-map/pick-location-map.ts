import {
  Component,
  EventEmitter,
  Output,
  AfterViewInit,
  signal,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FeatherModule } from 'angular-feather';
import { BsModalService } from 'ngx-bootstrap/modal';
import centroid from '@turf/centroid';

let mapboxgl: any;
(async () => {
  const mod = await import('mapbox-gl');
  mapboxgl = mod.default ?? mod;
})();

@Component({
  selector: 'app-pick-location-map',
  imports: [CommonModule, FormsModule, FeatherModule],
  templateUrl: './pick-location-map.html',
  styleUrl: './pick-location-map.scss',
})
export class PickLocationMap implements AfterViewInit, OnChanges {
  @Input() contextId: any;
  @Input() mapId: string = 'map';
  @Input() showFullUI: boolean = true;
  @Input() locations: any[] = [];
  @Input() showDefaultMarker: boolean = true;
  @Input() initialLat: number | null = null;
  @Input() initialLng: number | null = null;
  @Input() initialAddress: string = '';
  @Output() locationSaved = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  @Input() isEditMode: boolean = false;
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  searchText = signal<string>('');
  suggestions = signal<any[]>([]);
  private radialMarkers: any[] = [];
  private map!: any;
  private markers: any[] = [];
  private zoomThreshold = 12;
  private markersVisible = true;
  private mapLoaded = false;
  private polygonLayerIds: string[] = [];
  private polygonMarkers: any[] = [];
  private regionMarkers: any[] = [];
  private pickMarker: any;
  private readonly accessToken =
    'pk.eyJ1Ijoic2FydGhha3JvaGFsIiwiYSI6ImNsa2t5anZuYzE2aHAzZGtncm5seDVoeTYifQ.4qhMz512bITQzD4xwtzd0A';

  constructor(private http: HttpClient, private modalService: BsModalService) { }

  async ngAfterViewInit() {
    setTimeout(async () => {
      if (!mapboxgl) {
        const mod = await import('mapbox-gl');
        mapboxgl = mod.default ?? mod;
      }
      mapboxgl.accessToken = this.accessToken;
      const defaultLat = 27.5;
      const defaultLng = 77.0;
      this.lat.set(this.initialLat ?? defaultLat);
      this.lng.set(this.initialLng ?? defaultLng);
      this.searchText.set(this.initialAddress || '');
      this.mapLoaded = true;

      this.map = new mapboxgl.Map({
        container: this.mapId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this.lng(), this.lat()],
        zoom: 4,
        attributionControl: false,
      });

      this.map.on('load', () => {
        this.mapLoaded = true;

        this.initClusters();

        this.addMarkersFromLocations(this.locations);
        this.handleZoomChange();

        if (this.initialLat && this.initialLng) {
          this.setMarker(this.initialLat, this.initialLng, this.initialAddress, true);
          this.map.setCenter([this.initialLng, this.initialLat]);
        }

        this.map.resize();
        this.map.on('zoom', () => this.handleZoomChange());
        const pointData = this.buildPointGeoJSON(this.locations);
      });
    }, 100);
  }

  addMarkersFromLocations(locations: any[]) {
    this.markers = [];
    this.radialMarkers = [];
    this.polygonMarkers = [];
    this.regionMarkers = [];

    if ((!locations || locations.length === 0) && !this.isEditMode) {
      if (this.showDefaultMarker) {
        const defaultLat = 27.5;
        const defaultLng = 77.0;
        this.setMarker(defaultLat, defaultLng, 'Default Location', true);
        this.map.setZoom(4);
      }
      return;
    }

    if (!this.map) return;

    // Remove old markers
    this.markers.forEach((m) => m.remove());
    this.radialMarkers.forEach((m) => m.remove());
    this.polygonMarkers.forEach((m) => m.remove());
    this.regionMarkers.forEach((m) => m.remove());

    locations.forEach((loc, index: number) => {
      // 🔹 Radial
      if (loc.type === 'Radial') {
        if (loc.officeLocation?.lat && loc.officeLocation?.lng) {
          const lat = +loc.officeLocation.lat;
          const lng = +loc.officeLocation.lng;

          if (loc.radius != null) {
            this.updateCircle(lng, lat, Math.max(loc.radius, 0.1) * 1000, String(index + 1));
          }

          const marker = new mapboxgl.Marker({ color: '#0078ff' })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(loc.geofenceName || 'Radial'));

          this.radialMarkers.push(marker);

          marker.addTo(this.map);
        }
      }

      // 🔹 Polygon
      if (loc.type === 'Polygon') {
        const geometry = this.getSafeGeometry(loc.mapLocationCoordinates);
        if (!geometry) return;

        const feature: any = { type: 'Feature', geometry, properties: {} };
        const center = centroid(feature);
        const [lng, lat] = center.geometry.coordinates;

        // Marker create but map pe add mat karo
        const marker = new mapboxgl.Marker({ color: '#0078ff' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(loc.geofenceName));

        this.polygonMarkers.push(marker); // store for future use, map pe add nahi hoga

        // Polygon layers
        const sourceId = `polygon-${loc.id}`;
        if (!this.map.getSource(sourceId)) {
          this.map.addSource(sourceId, { type: 'geojson', data: feature });
          const fillId = `${sourceId}-fill`;
          const outlineId = `${sourceId}-outline`;

          this.map.addLayer({
            id: fillId,
            type: 'fill',
            source: sourceId,
            paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.35 },
            layout: { visibility: 'visible' },
          });

          this.map.addLayer({
            id: outlineId,
            type: 'line',
            source: sourceId,
            paint: { 'line-color': '#1e40af', 'line-width': 2 },
            layout: { visibility: 'visible' },
          });

          this.polygonLayerIds.push(fillId, outlineId);
        }
      }

      // 🔹 Region Based
      if (loc.type === 'Region Based') {
        const geometry = this.getSafeGeometry(loc.mapLocationCoordinates);
        if (!geometry) return;

        const center = centroid({ type: 'Feature', geometry, properties: {} });
        const [lng, lat] = center.geometry.coordinates;

        const marker = new mapboxgl.Marker({ color: '#0078ff' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(loc.geofenceName));

        this.regionMarkers.push(marker); // map pe add zoom-in ke baad
      }
      // 🔹 Region Based coloured
      // if (loc.type === 'Region Based') {
      //   const geometry = this.getSafeGeometry(loc.mapLocationCoordinates);
      //   if (!geometry) return;

      //   // Center for marker
      //   const center = centroid({ type: 'Feature', geometry, properties: {} });
      //   const [lng, lat] = center.geometry.coordinates;

      //   const marker = new mapboxgl.Marker({ color: '#0078ff' })
      //     .setLngLat([lng, lat])
      //     .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(loc.geofenceName));

      //   this.regionMarkers.push(marker); // still store marker if needed

      //   const sourceId = `region-${loc.id}`;
      //   const fillId = `${sourceId}-fill`;
      //   const outlineId = `${sourceId}-outline`;

      //   if (!this.map.getSource(sourceId)) {
      //     this.map.addSource(sourceId, {
      //       type: 'geojson',
      //       data: { type: 'Feature', geometry, properties: {} },
      //     });

      //     this.map.addLayer({
      //       id: fillId,
      //       type: 'fill',
      //       source: sourceId,
      //       paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.35 },
      //       layout: { visibility: 'visible' },
      //     });

      //     this.map.addLayer({
      //       id: outlineId,
      //       type: 'line',
      //       source: sourceId,
      //       paint: { 'line-color': '#1e40af', 'line-width': 2 },
      //       layout: { visibility: 'visible' },
      //     });

      //     this.polygonLayerIds.push(fillId, outlineId); // zoom logic ke liye
      //   }
      // }
    });
  }

  private createCircle(lng: number, lat: number, radiusInMeters: number) {
    const points = 64;
    const coords = [];

    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const offsetX = radiusInMeters * Math.cos((angle * Math.PI) / 180);
      const offsetY = radiusInMeters * Math.sin((angle * Math.PI) / 180);

      const newLng = lng + offsetX / (111320 * Math.cos((lat * Math.PI) / 180));
      const newLat = lat + offsetY / 110540;

      coords.push([newLng, newLat]);
    }

    coords.push(coords[0]);

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
        },
      ],
    };
  }

  updateCircle(lng: number, lat: number, radiusMeters: number, id: string) {
    const sourceId = `circle-${id}`;
    const fillId = `${sourceId}-fill`;
    const outlineId = `${sourceId}-outline`;

    const circle = this.createCircle(lng, lat, radiusMeters);

    if (this.map.getLayer(fillId)) this.map.removeLayer(fillId);
    if (this.map.getLayer(outlineId)) this.map.removeLayer(outlineId);
    if (this.map.getSource(sourceId)) this.map.removeSource(sourceId);

    this.map.addSource(sourceId, {
      type: 'geojson',
      data: circle,
    });

    this.map.addLayer({
      id: fillId,
      type: 'fill',
      source: sourceId,
      minzoom: 10,
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.3,
      },
    });

    this.map.addLayer({
      id: outlineId,
      type: 'line',
      source: sourceId,
      minzoom: 10,
      paint: {
        'line-color': '#1e40af',
        'line-width': 2,
      },
    });
  }
  private setMarker(lat: number, lng: number, popupText: string = '', draggable: boolean = true) {
    if (this.pickMarker) {
      this.pickMarker.remove();
      this.pickMarker = null;
    }

    this.pickMarker = new mapboxgl.Marker({
      color: '#0078ff',
      draggable,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

    if (popupText) {
      this.pickMarker.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(popupText));
    }

    if (draggable) {
      this.pickMarker.on('dragend', () => {
        const pos = this.pickMarker.getLngLat();
        this.lat.set(pos.lat);
        this.lng.set(pos.lng);
        this.reverseGeocode(pos.lng, pos.lat);
      });
    }

    this.map.setCenter([lng, lat]);
    this.map.setZoom(13);
  }

  searchLocation() {
    const text = this.searchText().trim();
    if (!text) {
      this.suggestions.set([]);
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      text
    )}.json?access_token=${this.accessToken}`;

    this.http.get<any>(url).subscribe({
      next: (res) => this.suggestions.set(res.features ?? []),
    });
  }

  selectSuggestion(place: any) {
    this.searchText.set(place.place_name);
    const [lng, lat] = place.center;
    this.lat.set(lat);
    this.lng.set(lng);

    this.map.flyTo({ center: [lng, lat], zoom: 13 });
    this.setMarker(lat, lng);
    this.suggestions.set([]);
  }

  private reverseGeocode(lng: number, lat: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.accessToken}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        const placeName = res.features?.[0]?.place_name ?? '';
        this.searchText.set(placeName);
      },
    });
  }

  saveLocation() {
    const latitude = this.lat();
    const longitude = this.lng();
    const address = this.searchText().trim();
    if (!latitude || !longitude || !address) return;

    this.locationSaved.emit({ latitude, longitude, address });
    this.closeModal();
  }

  closeModal() {
    this.modalService.hide();
  }
  renderRadial(item: any) {
    const lat = +item.officeLocation.lat;
    const lng = +item.officeLocation.lng;
    this.setMarker(lat, lng);
  }

  renderPolygon(item: any) {
    const coords = item.mapLocationCoordinates;
    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...coords, coords[0]]],
      },
    };

    if (!this.map.getSource('polygon-backend')) {
      this.map.addSource('polygon-backend', { type: 'geojson', data: polygon });

      this.map.addLayer({
        id: 'polygon-backend-fill',
        type: 'fill',
        source: 'polygon-backend',
        paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.3 },
        minzoom: 12,
      });

      this.map.addLayer({
        id: 'polygon-backend-outline',
        type: 'line',
        source: 'polygon-backend',
        paint: { 'line-color': '#1e40af', 'line-width': 2 },
        minzoom: 12,
      });
    } else {
      this.map.getSource('polygon-backend').setData(polygon);
    }
  }

  renderRegion(item: any) {
    const geometry = item.mapLocationCoordinates[0]?.boundaries?.geometry;
    if (!geometry) {
      return;
    }

    const sourceId = `region-source-${item.id}`;
    const fillId = `region-fill-${item.id}`;
    const outlineId = `region-outline-${item.id}`;

    if (this.map.getLayer(fillId)) this.map.removeLayer(fillId);
    if (this.map.getLayer(outlineId)) this.map.removeLayer(outlineId);
    if (this.map.getSource(sourceId)) this.map.removeSource(sourceId);

    this.map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry,
        properties: {},
      },
    });

    this.map.addLayer({
      id: fillId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.4,
      },
    });

    this.map.addLayer({
      id: outlineId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#1e40af',
        'line-width': 2,
      },
    });
  }
  private handleZoomChange() {
    const zoom = this.map.getZoom();

    if (zoom >= this.zoomThreshold) {
      this.radialMarkers.forEach((m) => m.addTo(this.map));
      this.regionMarkers.forEach((m) => m.addTo(this.map));

      this.polygonLayerIds.forEach((layer) => {
        if (this.map.getLayer(layer)) this.map.setLayoutProperty(layer, 'visibility', 'visible');
      });
    } else {
      this.radialMarkers.forEach((m) => m.remove());
      this.regionMarkers.forEach((m) => m.remove());

      this.polygonLayerIds.forEach((layer) => {
        if (this.map.getLayer(layer)) this.map.setLayoutProperty(layer, 'visibility', 'none');
      });
    }
  }

  private showMarkers() {
    if (!this.markersVisible) {
      this.markers.forEach((m) => m.addTo(this.map));
      this.markersVisible = true;
    }

    ['polygon-fill', 'polygon-outline', 'circle-fill', 'circle-outline'].forEach((layer) => {
      if (this.map.getLayer(layer)) {
        this.map.setLayoutProperty(layer, 'visibility', 'none');
      }
    });
  }

  private showShapes() {
    if (this.markersVisible) {
      this.markers.forEach((m) => m.remove());
      this.markersVisible = false;
    }

    ['polygon-fill', 'polygon-outline', 'circle-fill', 'circle-outline'].forEach((layer) => {
      if (this.map.getLayer(layer)) {
        this.map.setLayoutProperty(layer, 'visibility', 'visible');
      }
    });
  }

  ngOnChanges(changes: any) {
    if (changes['locations'] && this.map) {
      const source: any = this.map.getSource('location-clusters');
      if (source) {
        source.setData(this.buildClusterPoints(this.locations));
      }
    }
  }
  private buildPointGeoJSON(locations: any[]) {
    return {
      type: 'FeatureCollection',
      features: locations
        .filter((l) => l?.officeLocation?.lat != null && l?.officeLocation?.lng != null)
        .map((l) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [+l.officeLocation.lng, +l.officeLocation.lat],
          },
          properties: {
            name: l.geofenceName,
            type: l.type,
          },
        })),
    };
  }

  private initClusters() {
    if (this.map.getSource('location-clusters')) return;

    this.map.addSource('location-clusters', {
      type: 'geojson',
      data: this.buildClusterPoints(this.locations),
      cluster: true,
      clusterMaxZoom: 13, // Break clusters apart at zoom 13
      clusterRadius: 50, // Radius of the clusters
    });
    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'location-clusters',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#3b82f6',
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
        'circle-opacity': 0.7,
      },
    });

    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'location-clusters',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 14,
      },
    });

    this.map.addLayer({
      id: 'unclustered-point',
      type: 'symbol',
      source: 'location-clusters',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'marker-15',
        'icon-size': 1.5,
        'text-field': '{name}',
        'text-offset': [0, 1.2],
        'text-anchor': 'top',
      },
    });

    this.map.on('click', 'clusters', (e: any) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });

      const clusterId = features[0].properties.cluster_id;
      const source: any = this.map.getSource('location-clusters');

      source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;
        this.map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });
    });

    this.map.on('mouseenter', 'clusters', () => (this.map.getCanvas().style.cursor = 'pointer'));
    this.map.on('mouseleave', 'clusters', () => (this.map.getCanvas().style.cursor = ''));
  }

  private buildClusterPoints(locations: any[]) {
    return {
      type: 'FeatureCollection',
      features: locations
        .map((loc) => {
          let lat: number | null = null;
          let lng: number | null = null;

          if (
            loc.type === 'Radial' &&
            loc.officeLocation?.lat != null &&
            loc.officeLocation?.lng != null
          ) {
            lat = +loc.officeLocation.lat;
            lng = +loc.officeLocation.lng;
          } else if (
            (loc.type === 'Polygon' || loc.type === 'Region Based') &&
            loc.mapLocationCoordinates
          ) {
            // const geometry = this.getRegionGeometry(loc.mapLocationCoordinates);
            const geometry = this.getSafeGeometry(loc.mapLocationCoordinates);

            if (!geometry) return null;

            const c = centroid({
              type: 'Feature',
              geometry,
              properties: {},
            });

            if (!c?.geometry?.coordinates) return null;
            [lng, lat] = c.geometry.coordinates;
          }

          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: {
              name: loc.geofenceName,
              type: loc.type,
              id: loc.id,
            },
          };
        })
        .filter(Boolean),
    };
  }
  private getRegionGeometry(coords: any): GeoJSON.Polygon | GeoJSON.MultiPolygon | null {
    if (!Array.isArray(coords)) return null;

    if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
      return {
        type: 'Polygon',
        coordinates: [[...coords, coords[0]]],
      };
    }

    if (
      Array.isArray(coords[0]) &&
      Array.isArray(coords[0][0]) &&
      typeof coords[0][0][0] === 'number'
    ) {
      return {
        type: 'Polygon',
        coordinates: coords,
      };
    }

    if (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && Array.isArray(coords[0][0][0])) {
      return {
        type: 'MultiPolygon',
        coordinates: coords,
      };
    }

    return null;
  }
  private getSafeGeometry(coords: any): GeoJSON.Polygon | GeoJSON.MultiPolygon | null {
    if (!Array.isArray(coords) || coords.length === 0) return null;

    // 🔹 Simple Polygon [[lng,lat]]
    if (Array.isArray(coords[0]) && typeof coords[0][0] !== 'object') {
      const clean = coords
        .map((c: any) => [Number(c[0]), Number(c[1])])
        .filter((c: any) => !isNaN(c[0]) && !isNaN(c[1]));

      if (clean.length < 3) return null;

      const closed =
        clean[0][0] === clean[clean.length - 1][0] && clean[0][1] === clean[clean.length - 1][1]
          ? clean
          : [...clean, clean[0]];

      return {
        type: 'Polygon',
        coordinates: [closed],
      };
    }

    // 🔹 Polygon / MultiPolygon from backend
    if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) {
      return {
        type: coords[0][0][0] instanceof Array ? 'MultiPolygon' : 'Polygon',
        coordinates: coords,
      } as any;
    }

    return null;
  }
}
