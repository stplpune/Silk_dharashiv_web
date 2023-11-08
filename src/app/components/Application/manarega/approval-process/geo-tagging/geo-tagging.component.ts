import { Component } from '@angular/core';
declare var google: any;
@Component({
  selector: 'app-geo-tagging',
  templateUrl: './geo-tagging.component.html',
  styleUrls: ['./geo-tagging.component.scss']
})
export class GeoTaggingComponent {

  lat = 11.3821188;
  lng = 77.89472419999993;
  map!: any;
  polygon: any;

  onMapReady(map: any) {
    this.map = map;
    this.drawPolygon();
  }

  drawPolygon() {
    const paths = [
      { lat: 12.3175489124641, lng: 78.48798591874993 },
      { lat: 8.210490392434776, lng: 77.38935310624993 },
      { lat: 10.59482777210473, lng: 79.58661873124993 },
    ];

    this.polygon = new google.maps.Polygon({
      paths: paths,
      editable: true,
      draggable: true,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    });

    this.polygon.setMap(this.map);
  }

  set() {
    this.clear();
    this.drawPolygon();
  }

  clear() {
    this.polygon.setMap(null);
  }
}
