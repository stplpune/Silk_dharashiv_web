import { Component, OnDestroy } from '@angular/core';
import { AddDocumentsComponent } from './add-documents/add-documents.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent implements OnDestroy{
  applicationData:any;
  applicantDetails:any
  subscription!: Subscription;//used  for lang conv
  lang: any;
  routingData:any;
  encryptData:any;

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    private WebStorageService: WebStorageService,
    public encryptdecrypt: AesencryptDecryptService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() { 
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
      this.getRouteParam();
  }

  getRouteParam() {
    this.route.queryParams.subscribe((queryParams: any) => {
    this.routingData = queryParams['id'];
    });
    this.encryptData = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`);
   this.getByApplicationId();
  }



 

  getByApplicationId() {
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetApplication?Id='+ (this.encryptData) +'&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if (res.statusCode == '200') {
           this.applicationData = res.responseData;
            this.applicantDetails = this.applicationData.applicationModel
           console.log("this.applicationData",this.applicationData.applicationModel )     
           }
      }
    })
  }

  adddocuments() {
    this.dialog.open(AddDocumentsComponent, {
      width: '40%'
    })
  }

  viewdetails() {
    this.dialog.open(ViewDetailsComponent, {
      width: '80%'
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
