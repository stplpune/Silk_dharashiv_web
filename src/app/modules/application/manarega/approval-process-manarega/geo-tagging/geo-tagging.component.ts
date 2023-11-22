import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
declare var google: any;
@Component({
  standalone:true,
  selector: 'app-geo-tagging',
  templateUrl: './geo-tagging.component.html',
  styleUrls: ['./geo-tagging.component.scss'],
  imports: [DashPipe]
})
export class GeoTaggingComponent {

  constructor(public dialogRef: MatDialogRef<GeoTaggingComponent>, @Inject(MAT_DIALOG_DATA) public data: any){

  }

  lat = 18.1853;
  lng = 76.0420;
  map!: any;
  polygon: any;


  onMapReady(map: any) {
    this.map = map;
  
    this.data?.polygonText ?   this.drawPolygon():'';
  }

  drawPolygon() {
    let bounds: any = new google.maps.LatLngBounds();
    let polygonData = this.data?.polygonText;
    let splitLatLong = polygonData.split(',');
    const paths: any = [];

    splitLatLong.find((ele: any) => {
      let split = ele.split(' ');
      paths.push({ lat: +split[1], lng: +split[0] })
      bounds.extend(new google.maps.LatLng(+split[1], +split[0]));
    })

    this.polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    });

    this.polygon.setMap(this.map);
    this.map?.fitBounds(bounds);
  }

  set() {
    this.clear();
    this.drawPolygon();
  }

  clear() {
    this.polygon.setMap(null);
  }
}
