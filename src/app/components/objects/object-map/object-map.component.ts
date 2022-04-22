import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
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
  selector: 'app-object-map',
  templateUrl: './object-map.component.html',
  styleUrls: ['./object-map.component.scss'],
})
export class ObjectMapComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
     this.makeMarkers(this.map, this.data);
    this.makePolygons(this.map, this.data);
  }

  makeMarkers(map: L.Map, coords: any): void {
    console.log(coords);

    coords.forEach((coord: any) => {
      const { lat, lng } = coord;
      if (lat && lng) {
        const marker = L.marker([lat, lng]);
        marker.addTo(map);
      }
    });
  }

  makePolygons(map: L.Map, coords: any): void {
    console.log(coords);
    if (Array.isArray(coords)) {
      coords.forEach((item: any) => {
        const polygon = new L.Polygon(item.coords);
        polygon.addTo(map);
      });
    }
  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [51.13, 71.42],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }
}
