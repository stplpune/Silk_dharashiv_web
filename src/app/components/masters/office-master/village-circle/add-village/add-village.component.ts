import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from 'src/app/core/services/master.service';
import { VillageCircleComponent } from '../village-circle.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';

@Component({
  selector: 'app-add-village',
  templateUrl: './add-village.component.html',
  styleUrls: ['./add-village.component.scss']
})
export class AddVillageComponent {
  villageForm!: FormGroup;
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  villageArray = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor
    (
      private fb: FormBuilder,
      private master: MasterService,
      public dialogRef: MatDialogRef<VillageCircleComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private spinner: NgxSpinnerService,
      private WebStorageService: WebStorageService,
      private apiService: ApiService,
      private commonMethodService: CommonMethodsService,
      private errorService: ErrorHandlingService,
  ) { }

  ngOnInit() {
    this.getFormData();
    this.getState();
  }

  //   {
  //     "srNo": 1,
  //     "id": 4,
  //     "circleName": "sd",
  //     "m_CircleName": "dsfsdf",
  //     "stateId": 1,
  //     "state": "Maharashtra",
  //     "m_State": "महाराष्ट्र",
  //     "districtId": 3,
  //     "district": null,
  //     "m_District": null,
  //     "talukaId": 3,
  //     "taluka": "Lohara",
  //     "m_Taluka": "लोहारा",

  // }

  getFormData() {
    this.villageForm = this.fb.group({
      id: [this.data ? this.data?.id : 0],
      stateId: [this.data ? this.data?.stateId : 1,[Validators.required]],
      districtId: [this.data ? this.data?.districtId : 1,[Validators.required]],
      talukaId: [this.data ? this.data?.talukaId : '',[Validators.required]],
      villages: [this.data ? this.data?.villages : '',[Validators.required]],
      circleName: [this.data ? this.data?.circleName : '',[Validators.required]],
      m_CircleName: [this.data ? this.data?.m_CircleName : '',[Validators.required]],
      flag: [this.data ? "u" : "i"],
      createdBy: [this.WebStorageService.getUserId()]
    })
  }

  get f() { return this.villageForm.controls };

  getState() {
    let stateId = this.villageForm.value.stateId;
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.data ? (this.f['stateId'].setValue(stateId), this.getDisrict()) : '';
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict() {
    let distId = this.villageForm.value.districtId;
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.data ? (this.f['districtId'].setValue(distId), this.getTaluka()) : '';
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getTaluka() {
    let stateId = this.villageForm.value.stateId;
    let distId = this.villageForm.value.districtId;
    let talId = this.villageForm.value.talukaId;
    this.master.GetAllTaluka(stateId, distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        this.data ? (this.f['districtId'].setValue(talId), this.getVillage()) : '';
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getVillage() {
    let stateId = this.villageForm.value.stateId;
    let distId = this.villageForm.value.districtId;
    let talukaId = this.villageForm.value.talukaId;
    this.master.GetAllVillages(stateId, distId, talukaId, 0).subscribe({
      next: ((res: any) => {
        this.villageArray = res.responseData;
        let newVillage = new Array();
        this.data?.villages.forEach((res: any) => {
          newVillage.push(res.id)
        });
        this.data ? this.f['villages'].setValue(newVillage) : ''
      }), error: (() => {
        this.villageArray = [];
      })
    })
  }

  onSubmitData() {
    this.spinner.show();
    let formData = this.villageForm.value;
    if (this.villageForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      formData.villages = this.villageForm.value.villages.toString();
      this.apiService.setHttp('post', 'sericulture/api/TalukaBlocks/AddUpdateVillageCircles', false, formData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.dialogRef.close('Yes');
            this.formDirective.resetForm();
          } else {
            this.spinner.hide();
            this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.spinner.hide();
          this.errorService.handelError(error.status);
        }
      })
    }
  }

  clearDropDown(flag?: any) {
    if (flag == 'village') {
      this.f['villages'].setValue('');
      this.villageArray = [];
    }
  }




}
