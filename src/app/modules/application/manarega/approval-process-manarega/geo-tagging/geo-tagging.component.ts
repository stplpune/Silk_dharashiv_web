import { AgmCoreModule } from '@agm/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { TranslateModule } from '@ngx-translate/core';

declare var google: any;

@Component({
  standalone: true,
  selector: 'app-geo-tagging',
  templateUrl: './geo-tagging.component.html',
  styleUrls: ['./geo-tagging.component.scss'],
  imports: [DashPipe, MatDialogModule, AgmCoreModule, DatePipe, MatButtonModule, CommonModule, TranslateModule]
})
export class GeoTaggingComponent {
  subscription!: Subscription;//used  for lang conv
  lang: any;
  lat = 18.1853;
  lng = 76.0420;
  map!: any;
  polygon: any;

  constructor(public dialogRef: MatDialogRef<GeoTaggingComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService, private WebStorageService: WebStorageService) {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    });
  }

  onMapReady(map: any) {
    this.map = map;

    this.data?.polygonText ? this.drawPolygon() : '';
  }

  drawPolygon() {
    let bounds: any = new google.maps.LatLngBounds();
    let polygonData = this.data?.polygonText;
    let splitLatLong = polygonData.split(',');
    const paths: any = [];

    splitLatLong.find((ele: any) => {
      let split = ele.split(' ');
      paths.push({ lat: +split[0], lng: +split[1] })
      bounds.extend(new google.maps.LatLng(+split[0], +split[1]));
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


  getAppHistoryDetails() {
    this.apiService.setHttp('get', 'sericulture/api/ApprovalMaster/GetApprovalHistoryDetails?Id=' + this.data.applicationId + '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
      }
      else {
        this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errorHandler.handelError(error.status);
    })
  }

  viewimage(pathUrl?: string) {
    window.open(pathUrl, '_blank')
  }
}