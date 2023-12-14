import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';

declare var google: any;

@Component({
  standalone:true,
  selector: 'app-geo-tagging',
  templateUrl: './geo-tagging.component.html',
  styleUrls: ['./geo-tagging.component.scss'],
  imports: [DashPipe, MatDialogModule, AgmCoreModule, DatePipe, MatButtonModule]
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

  
  getAppHistoryDetails(){
    // let formData =this.otpForm.value;
    // let sendOtp=formData.otpA + formData.otpB + formData.otpC + formData.otpD + formData.otpE
    // if(this.otpForm.invalid){
    //   this.spinner.hide();
    //   return;
    // } else{
    //   this.apiService.setHttp('get', 'sericulture/api/OtpTran/VerifyOTP?MobileNo='+this.farmerMobileNo.value+'&OTP='+sendOtp+'&PageName=Login&CreatedBy=0&lan='+this.lang+'&LoginFlag=web', false, false, false, 'baseUrl');
    //   this.apiService.getHttp().subscribe((res: any) => {
    //     if (res.statusCode == "200") {
    //       this.commonMethod.snackBar(res.statusMessage, 0);
    //       this.router.navigate(['farmer-signup']);
    //       this.farmerMobileNo.reset();
    //       this.otpForm.reset();
    //     }
    //     else {
    //       this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
    //     }
    //   }, (error: any) => {        
    //     this.errorHandler.handelError(error.status);
    //   })
    // }
  }
}


// sericulture/api/ApprovalMaster/GetApprovalHistoryDetails
