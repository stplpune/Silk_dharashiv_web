import { Component } from '@angular/core';
import { MasterService } from 'src/app/core/services/master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OtpSendReceiveComponent } from 'src/app/shared/components/otp-send-receive/otp-send-receive.component';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-farmersignup',
  templateUrl: './farmersignup.component.html',
  styleUrls: ['./farmersignup.component.scss']
})
export class FarmersignupComponent {

  signUpForm !: FormGroup;
  districtArray = new Array();
  talukaArray = new Array();
  villageArray = new Array();

  constructor(
    private master: MasterService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public validator: ValidationService
  ) { }

  ngOnInit() {
    this.formData();
    this.getDisrict();
  }

  formData() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.validator.fullName)]],
      mobileNo: ['', [Validators.required, Validators.pattern(this.validator.mobile_No)]],
      districtId: ['', [Validators.required]],
      talukaId: ['', [Validators.required]],
      villageId: ['', [Validators.required]]
    })
  }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getTaluka() {
    let distId = this.signUpForm.getRawValue().districtId;
    this.master.GetAllTaluka(1, distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getVillage() {
    let talId = this.signUpForm.getRawValue().talukaId;
    let distId = this.signUpForm.getRawValue().districtId;
    this.master.GetAllVillages(1, distId, talId, 0).subscribe({
      next: ((res: any) => {
        this.villageArray = res.responseData;
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }


  openSendOtpComponent() {
    if (this.signUpForm.invalid) {
      return;
    } else {
      let dialogObj = {
        header: "Sign UP OTP",
        button: "Verify OTP",
        pageName: "farmer-signUp",
        mobileNo: this.signUpForm.getRawValue().mobileNo
      };
      const dialogRef = this.dialog.open(OtpSendReceiveComponent, {
        width: '50%',
        data: dialogObj,
        disableClose: true,
        autoFocus: true,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == 'Yes') {
          console.log(this.signUpForm.getRawValue())
          // let value = this.webStrorge.getVerifyOtp();
          // if (value == true) {
          //call signUp submit data api
          // }
        }
      });
    }

  }
}
