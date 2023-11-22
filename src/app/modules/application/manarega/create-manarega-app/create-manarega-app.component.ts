import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
//import { NgxSpinnerService } from 'ngx-spinner';
//import { ApiService } from 'src/app/core/services/api.service';
// import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
// import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
// import { FileUploadService } from 'src/app/core/services/file-upload.service';
//import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-create-manarega-app',
  templateUrl: './create-manarega-app.component.html',
  styleUrls: ['./create-manarega-app.component.scss']
})
export class CreateManaregaAppComponent {
  manaregaFrm !: FormGroup;

  constructor(public dialog: MatDialog,
    // private apiService: ApiService,
    // private WebStorageService: WebStorageService,
    private fb: FormBuilder,
    // private spinner: NgxSpinnerService,
    // private errorHandler: ErrorHandlingService,
    // private fileUplService: FileUploadService,
    // private commonMethod: CommonMethodsService,
  ) { }

  ngOnInit() {
    // this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
    //   this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
    //   this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    // })
    this.addManaregaFrm();

  }

  addManaregaFrm() {
    this.manaregaFrm = this.fb.group({
      "id": [0],
      "farmerId": [1],
      "schemeTypeId": [1],
      "applicationNo": [1],
      "mobileNo1": [''],
      "aadharNo": [''],
      "profilePhotoPath": [''],
      "fullName": [''],
      "mobileNo2": [''],
      "birthDate": [''],
      "gender": [''],//no
      "qualificationId": [''],//no
      "stateId": [''],//no
      "districtId": [''],//no
      "talukaId": [''],//no
      "grampanchayatId": [''],//no
      "village": [''],
      "address": [''],
      "pinCode": [''],
      "mn_JobCardNo": [''],
      "categoryId": [''],//no
    })
  }

}
