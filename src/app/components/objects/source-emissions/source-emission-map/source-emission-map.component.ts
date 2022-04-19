import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { SourceEmissionsService } from '@services/objects/source-emissions.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as L from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-source-emission-map',
  templateUrl: './source-emission-map.component.html',
  styleUrls: ['./source-emission-map.component.scss'],
})
export class SourceEmissionMapComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  areaId!: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sourceEmissionService: SourceEmissionsService
  ) {
    this.areaId = data.id;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.makeMarkers(this.map);
  }

  makeMarkers(map: L.Map): void {
    this.sourceEmissionService
      .getSourceEmissionList(this.areaId, 'ins')
      .subscribe({
        next: (values) => {
          values.forEach((value) => {
            const lat = value.lat;
            const lon = value.lng;
            const marker = L.marker([lat, lon]);
            const list: any = [
              [51.130711477579766, 71.42964567927775],
              [51.13019904359833, 71.43296296927826],
              [51.12592320091746, 71.43104914812412],
              [51.126371622475105, 71.42788496381593],
            ];
            const polygon = new L.Polygon(list);
            polygon.addTo(map);
            marker.addTo(map);

            const circle = L.circleMarker([lat, lon], {
              radius: 50,
            });

            circle.bindPopup(this.makeCapitalPopup(value));

            circle.addTo(map);
          });
        },
      });

    this.sourceEmissionService
      .getSourceEmissionList(this.areaId, 'calc')
      .subscribe({
        next: (values) => {
          values.forEach((value) => {
            const { lat, lng } = value;
            const marker = L.marker([lat, lng]);
            marker.addTo(map);
          });
        },
      });
  }

  makeCapitalPopup(data: any): string {
    return `` + `<div> Истчоник: ${data.sourceName}</div>`;
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [51.13, 71.42],
      zoom: 13,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(this.map);

    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    var drawPluginOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
          },
          shapeOptions: {
            color: '#97009c',
          },
        },
        // disable toolbar item by setting it to false
        polyline: false,
        circle: false, // Turns off this drawing tool
        rectangle: false,
        marker: false,
      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false,
      },
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers

    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    this.map.on('draw:created', function (e) {});
  }
}
