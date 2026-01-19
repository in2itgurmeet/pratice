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
  selector: 'app-map',
  imports: [CommonModule, FormsModule, FeatherModule],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit, OnChanges {
  @Input() contextId: any;
  @Input() mapId: string = 'map';
  @Input() showSearch: boolean = true;
  @Input() showHeader: boolean = false;
  @Input() showCross: boolean = false;
  @Input() location: any;
  @Input() showDefaultMarker: boolean = true;
  @Input() geofenceMode: any;
  @Input() radius: any;
  @Input() polygonRegionCoord: any;
  @Output() expendMap = new EventEmitter<boolean>();
  @Input() isSearchLocationRequired: boolean = true;
  @Input() isOfficeLocationSelected: boolean = false;
  /* polygon variables*/
  draw!: any;
  drawing = false;
  coords: any = [];
  polygonId: any = 'manual-polygon';
  /**/
  defaultLat = 28.6139;
  defaultLng = 77.209;
  @Output() locationSaved = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  @Output() polygonCoord = new EventEmitter<any>();
  @Output() regionCoord = new EventEmitter<void>();
  @Output() locationSelectionfromSuggestions = new EventEmitter<any>();
  @Input() disableExpandIcon: boolean = false;
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  searchText = signal<string>('');
  suggestions = signal<any[]>([]);
  private map!: any;
  private marker!: any;
  private markers: any[] = [];

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

      // const defaultLat = 28.6139;
      // const defaultLng = 77.209;

      this.lat.set(this.defaultLat);
      this.lng.set(this.defaultLng);

      this.map = new mapboxgl.Map({
        container: this.mapId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this.defaultLng, this.defaultLat],
        zoom: 4,
        attributionControl: false,
      });

      this.map.on('load', () => {
        this.addpolygon();
        this.addRegion();
        this.disableAllModes();
        this.updateMap();
        this.map.resize();
      });
    }, 100);
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

  updateCircle(lng: any, lat: any, radiusMeters: number) {
    const circle = this.createCircle(lng, lat, radiusMeters);

    if (!this.map.getSource('circle')) {
      this.map.addSource('circle', {
        type: 'geojson',
        data: circle,
      });

      this.map.addLayer({
        id: 'circle-fill',
        type: 'fill',
        source: 'circle',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.3,
        },
      });

      this.map.addLayer({
        id: 'circle-outline',
        type: 'line',
        source: 'circle',
        paint: {
          'line-color': '#1e40af',
          'line-width': 2,
        },
      });
    } else {
      this.map.getSource('circle').setData(circle);
    }
  }

  private setMarker(lat: any, lng: any, popupText: string = '') {
    if (this.marker) this.marker.remove();

    this.marker = new mapboxgl.Marker({ color: '#0078ff', draggable: true })
      .setLngLat([lng, lat])
      .addTo(this.map);
    if (popupText) {
      this.marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(popupText));
    }
    this.updateCircle(lng, lat, this.radius * 1000);
    this.marker.on('dragend', () => {
      const pos = this.marker.getLngLat();
      this.lat.set(pos.lat);
      this.lng.set(pos.lng);
      this.updateCircle(pos.lng, pos.lat, this.radius * 1000);
      this.reverseGeocode(pos.lng, pos.lat);
    });
    this.marker.on('drag', () => {
      const pos = this.marker.getLngLat();
      this.updateCircle(pos.lng, pos.lat, this.radius * 1000);
    });
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

    if (this.geofenceMode == 'Radial') {
      this.locationSelectionfromSuggestions.emit({ lat: lat, lng: lng, name: place.place_name });
      if (!this.isOfficeLocationSelected) {
        this.map.flyTo({ center: [lng, lat], zoom: 13 });
        this.setMarker(lat, lng);
      }
    } else {
      this.map.flyTo({ center: [lng, lat], zoom: 13 });
    }
    this.suggestions.set([]);
  }

  private reverseGeocode(lng: number, lat: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.accessToken}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        const placeName = res.features?.[0]?.place_name ?? '';
        this.searchText.set(placeName);
        this.locationSelectionfromSuggestions.emit({ lat: lat, lng: lng, name: this.searchText() });
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
  ngOnChanges(changes: any) {
    if (changes['geofenceMode'] && this.map) {
      if (this.geofenceMode == 'Polygon') {
        this.enablePolygonMode();
      } else if (this.geofenceMode == 'Region Based') {
        this.enableRegionMode();
      } else if (this.geofenceMode == 'Radial') {
        this.disableAllModes();
      }
    }
    if (changes['radius'] && this.map) {
      if (this.geofenceMode == 'Radial') {
        this.setMarker(this.lat(), this.lng());
      }
    }
    if (changes['location'] && this.map) {
      if (this.geofenceMode == 'Radial') {
        if (this.location && this.location.lat && this.location.lng) {
          const lat = Number(this.location?.lat);
          const lng = Number(this.location?.lng);

          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            this.lat.set(lat);
            this.lng.set(lng);
          }
          // let lat = parseFloat(this.location.lat);
          // let lng = parseFloat(this.location.lng);
          // this.lat.set(lat);
          // this.lng.set(lng);
          this.searchText.set(this.location.name);
          this.map.flyTo({ center: [lng, lat], zoom: 13 });
          this.setMarker(this.lat(), this.lng());
        }
      }
    }
    if (changes['polygonRegionCoord'] && this.map) {
      if (this.geofenceMode == 'Polygon') {
        this.enablePolygonMode();
        this.searchText.set(this.polygonRegionCoord.name);
        if (this.polygonRegionCoord.coord) this.updatePolygon(this.polygonRegionCoord.coord);
      } else if (this.geofenceMode == 'Region Based') {
        this.enableRegionMode();
        this.searchText.set(this.polygonRegionCoord.name);
        if (this.polygonRegionCoord.coord) this.updateRegion(this.polygonRegionCoord.coord);
      }
    }
  }

  //====================================================//

  enableRegionMode() {
    this.disableAllModes();
    this.addRegion();

    // show region layers
    this.map.setLayoutProperty('regions-fill', 'visibility', 'visible');
    this.map.setLayoutProperty('regions-outline', 'visibility', 'visible');
    this.map.setLayoutProperty('selected-region-fill', 'visibility', 'visible');
    this.map.setLayoutProperty('selected-region-outline', 'visibility', 'visible');

    // Enable region click
    this.map.on('click', 'regions-fill', this.handleRegionClick);
  }

  handlePolygonClick = (e: any) => {
    if (this.geofenceMode !== 'Polygon') return; // just in case
    const { lng, lat } = e.lngLat;

    if (!this.drawing) {
      // First click: start polygon
      this.drawing = true;
      this.coords = [];
      this.coords.push([lng, lat]);
      return;
    }
    // // Show first point on map immediately
    //   this.map.getSource(this.polygonId).setData({
    //     type: 'Feature',
    //     geometry: {
    //       type: 'Polygon',
    //       coordinates: [[...this.coords, this.coords[0]]],
    //     },
    //   });
    // Add point on every click (after first)
    this.coords.push([lng, lat]);
    // this.map.getSource(this.polygonId).setData({
    //   type: 'Feature',
    //   geometry: { type: 'Polygon', coordinates: [this.coords.concat([this.coords[0]])] },
    // });
  };
  enablePolygonMode() {
    this.disableAllModes();
    this.addpolygon();
    // Hide region layers
    // this.map.setLayoutProperty('regions-fill', 'visibility', 'none');
    // this.map.setLayoutProperty('regions-outline', 'visibility', 'none');

    // Show polygon layers
    this.map.on('click', this.handlePolygonClick);
    this.map.on('mousemove', this.handlePolygonMove);
    this.map.on('dblclick', this.handlePolygonDoubleClick);
    this.map.setLayoutProperty(this.polygonId, 'visibility', 'visible');
    this.map.setLayoutProperty(this.polygonId + '-outline', 'visibility', 'visible');

    // Disable region click
    this.map.off('click', 'regions-fill', this.handleRegionClick);
  }

  handleRegionClick = (e: any) => {
    const feature = e.features[0];

    // highlight clicked region
    this.map.getSource('selected-region').setData({
      type: 'FeatureCollection',
      features: [feature],
    });
  };
  tempLineId = 'temp-line';
  addpolygon() {
    this.map.addSource(this.polygonId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[]], // initially empty
        },
      },
    });

    // Add a fill layer for the polygon
    this.map.addLayer({
      id: this.polygonId,
      type: 'fill',
      source: this.polygonId,
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.3,
      },
    });

    // Outline (optional)
    this.map.addLayer({
      id: this.polygonId + '-outline',
      type: 'line',
      source: this.polygonId,
      paint: {
        'line-color': '#1e40af',
        'line-width': 2,
      },
    });

    // Temporary line for preview
    this.map.addSource(this.tempLineId, {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } },
    });

    this.map.addLayer({
      id: this.tempLineId,
      type: 'line',
      source: this.tempLineId,
      paint: { 'line-color': '#1e40af', 'line-width': 2 },
    });
    this.map.doubleClickZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.on('click', this.handlePolygonClick);
    this.map.on('mousemove', this.handlePolygonMove);
    this.map.on('dblclick', this.handlePolygonDoubleClick);

    this.map.doubleClickZoom.disable();
  }

  addRegion() {
    this.map.addSource('regions', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson',
    });

    // layer for region selection///
    this.map.addLayer({
      id: 'regions-fill',
      type: 'fill',
      source: 'regions',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0,
      },
    });

    this.map.addLayer({
      id: 'regions-outline',
      type: 'line',
      source: 'regions',
      paint: {
        'line-color': '#1e40af',
        'line-width': 2,
        'line-opacity': 0,
      },
    });
    this.map.addSource('selected-region', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.map.addLayer({
      id: 'selected-region-fill',
      type: 'fill',
      source: 'selected-region',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.3,
      },
    });

    this.map.addLayer({
      id: 'selected-region-outline',
      type: 'line',
      source: 'selected-region',
      paint: {
        'line-color': '#1e40af',
        'line-width': 2,
      },
    });

    this.map.on('click', 'regions-fill', (e: any) => {
      const feature = e.features[0];

      // highlight clicked region
      const polygonFeature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [feature.geometry.coordinates], // wrap in an array because Polygon expects [ [lng, lat], ... ]
        },
        properties: {},
      };
      this.map.getSource('selected-region').setData({
        type: 'FeatureCollection',
        features: [polygonFeature],
      });

      // log region name
      let region: any = {
        name: `${feature.properties.NAME_1} ${feature.properties.NAME_0}`,
        coord: feature.geometry.coordinates,
      };
      this.regionCoord.emit(region);
    });

    this.map.on('mouseenter', 'regions-fill', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'regions-fill', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  disableAllModes() {
    // this.geofenceMode = 'None';

    // hide layers
    this.removeMarker();
    this.removeCircle();
    this.removePolygon();
    this.removeRegion();
    if (this.map.getLayer('regions-fill')) {
      this.map.setLayoutProperty('regions-fill', 'visibility', 'none');
    }
    if (this.map.getLayer('regions-outline')) {
      this.map.setLayoutProperty('regions-outline', 'visibility', 'none');
    }
    if (this.map.getLayer('selected-region-fill')) {
      this.map.setLayoutProperty('selected-region-fill', 'visibility', 'none');
    }
    if (this.map.getLayer('selected-region-outline')) {
      this.map.setLayoutProperty('selected-region-outline', 'visibility', 'none');
    }
    if (this.map.getLayer(this.polygonId)) {
      this.map.setLayoutProperty(this.polygonId, 'visibility', 'none');
      this.map.setLayoutProperty(this.polygonId + '-outline', 'visibility', 'none');
    }

    // remove events
    this.map.off('click', 'regions-fill', this.handleRegionClick);
    this.map.off('click', this.handlePolygonClick);
    this.map.off('mousemove', this.handlePolygonMove);
    this.map.off('dblclick', this.handlePolygonDoubleClick);

    this.drawing = false;
  }

  removeMarker() {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
  }

  removeCircle() {
    if (this.map.getLayer('circle-fill')) {
      this.map.removeLayer('circle-fill');
    }
    if (this.map.getLayer('circle-outline')) {
      this.map.removeLayer('circle-outline');
    }
    if (this.map.getSource('circle')) {
      this.map.removeSource('circle');
    }
  }

  handlePolygonMove = (e: any) => {
    if (!this.drawing || this.geofenceMode !== 'Polygon') return;

    const { lng, lat } = e.lngLat;
    const tempCoords = [...this.coords, [lng, lat]];

    this.map.getSource(this.tempLineId).setData({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: tempCoords },
    });
    // const preview = [...this.coords, [lng, lat], this.coords[0]];

    // this.map.getSource(this.polygonId).setData({
    //   type: 'Feature',
    //   geometry: { type: 'Polygon', coordinates: [preview] },
    // });
  };

  handlePolygonDoubleClick = async (e: any) => {
    if (!this.drawing || this.geofenceMode !== 'Polygon') return;

    e.preventDefault(); // Prevent map zoom on double click

    const { lng, lat } = e.lngLat;
    this.coords.push([lng, lat]); // Add the last clicked point

    // Close the polygon
    const finalPolygon = [...this.coords, this.coords[0]];

    // Update polygon source on the map
    this.map.getSource(this.polygonId).setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [finalPolygon],
      },
    });

    // Create GeoJSON feature for Turf.js
    const polygonFeature: any = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [finalPolygon],
      },
    };

    // Calculate centroid
    const center = centroid(polygonFeature);
    const [clng, clat] = center.geometry.coordinates;

    // Get city, state, country from centroid
    const location = await this.getLocationDetails(clng, clat);

    let name = '';
    if (location) {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      if (location.country) parts.push(location.country);
      name = parts.join(',');
    }

    // Emit polygon details
    if (this.searchText()) {
      name = this.searchText();
    }
    const polygonDetails = { name, coord: finalPolygon };
    this.polygonCoord.emit(polygonDetails);

    // Reset drawing state
    this.drawing = false;
    this.coords = [];

    // Clear temporary line used during drawing
    if (this.map.getSource('temp-line')) {
      this.map.getSource('temp-line').setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [] },
      });
    }
  };

  removePolygon() {
    if (!this.map) return;

    // Remove layers
    if (this.map.getLayer(this.polygonId)) {
      this.map.removeLayer(this.polygonId);
    }

    if (this.map.getLayer(this.polygonId + '-outline')) {
      this.map.removeLayer(this.polygonId + '-outline');
    }

    // Remove source
    if (this.map.getSource(this.polygonId)) {
      this.map.removeSource(this.polygonId);
    }

    // Remove source
    if (this.map.getLayer('temp-line')) {
      this.map.removeLayer('temp-line');
    }
    if (this.map.getSource(this.tempLineId)) {
      this.map.removeSource(this.tempLineId);
    }

    // Reset state
    this.coords = [];
    this.drawing = false;
  }
  removeRegion() {
    if (!this.map) return;

    if (this.map.getLayer('regions-fill')) this.map.removeLayer('regions-fill');
    if (this.map.getLayer('regions-outline')) this.map.removeLayer('regions-outline');
    // Remove selected-region layers
    if (this.map.getLayer('selected-region-fill')) {
      this.map.removeLayer('selected-region-fill');
    }

    if (this.map.getLayer('selected-region-outline')) {
      this.map.removeLayer('selected-region-outline');
    }

    // Remove region sources
    if (this.map.getSource('regions')) {
      this.map.removeSource('regions');
    }

    if (this.map.getSource('selected-region')) {
      this.map.removeSource('selected-region');
    }
  }

  resetMap() {
    // this.disableAllModes();
    if (this.geofenceMode == 'Polygon') {
      this.enablePolygonMode();
    } else if (this.geofenceMode == 'Region Based') {
      this.enableRegionMode();
    } else if (this.geofenceMode == 'Radial') {
      this.disableAllModes();
    }
  }
  emitExpandData() {
    if (!this.disableExpandIcon) {
      this.expendMap.emit(true);
    }
  }

  async getAddress(lng: number, lat: number) {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&types=address,place`
    );

    const data = await res.json();
    return data.features?.[0]?.place_name || 'Address not found';
  }

  async getLocationDetails(
    lng: number,
    lat: number
  ): Promise<{ city?: string; state?: string; country?: string }> {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
      `access_token=${mapboxgl.accessToken}&types=place,region,country`
    );
    const data = await res.json();

    let city, state, country;

    if (data.features && data.features.length > 0) {
      data.features.forEach((f: any) => {
        if (f.place_type.includes('place')) city = f.text; // city
        if (f.place_type.includes('region')) state = f.text; // state/province
        if (f.place_type.includes('country')) country = f.text; // country
      });
    }

    return { city, state, country };
  }

  updatePolygon(coords: number[][]) {
    const source: any = this.map.getSource(this.polygonId) as mapboxgl.GeoJSONSource;

    source.setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords], // must be wrapped in an array
      },
    });

    // Create GeoJSON feature for Turf.js
    const polygonFeature: any = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords],
      },
    };

    // Calculate centroid
    const center = centroid(polygonFeature);
    const [clng, clat] = center.geometry.coordinates;
    this.map.flyTo({ center: [clng, clat], zoom: 13 });
  }

  updateRegion(coordinates: any) {
    // highlight clicked region
    const polygonFeature: any = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coordinates,
      },
      properties: {},
    };
    this.map.getSource('selected-region').setData({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const center = centroid(polygonFeature);
    const [clng, clat] = center.geometry.coordinates;
    this.map.flyTo({ center: [clng, clat], zoom: 4 });
  }

  updateMap() {
    if (this.geofenceMode == 'Radial') {
      if (this.location) {
        if (this.location && this.location.lat && this.location.lng) {
          let lat = parseFloat(this.location.lat);
          let lng = parseFloat(this.location.lng);
          this.lat.set(lat);
          this.lng.set(lng);
          this.searchText.set(this.location.name);
          this.map.flyTo({ center: [lng, lat], zoom: 13 });
          this.setMarker(this.lat(), this.lng());
        }
      }
    } else if (this.geofenceMode == 'Polygon') {
      if (this.polygonRegionCoord) {
        this.enablePolygonMode();
        this.searchText.set(this.polygonRegionCoord.name);
        if (this.polygonRegionCoord.coord) this.updatePolygon(this.polygonRegionCoord.coord);
      }
    } else if (this.geofenceMode == 'Region Based') {
      if (this.polygonRegionCoord) {
        this.enableRegionMode();
        this.searchText.set(this.polygonRegionCoord.name);
        if (this.polygonRegionCoord.coord) this.updateRegion(this.polygonRegionCoord.coord);
      }
    }
  }
}
