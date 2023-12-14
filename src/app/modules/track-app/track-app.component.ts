import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-track-app',
  templateUrl: './track-app.component.html',
  styleUrls: ['./track-app.component.scss']
})
export class TrackAppComponent {
  applicationId: any;
  constructor(public validation: ValidationService, private commonMethods: CommonMethodsService) {

  }

  appId = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(6), Validators.pattern(this.validation?.alphaNumericWithoutSpace)]);

  searchAppliation() {
    if (this.appId.status == 'VALID') {
      this.applicationId = this.appId.getRawValue()
    }else{
      this.commonMethods.snackBar('Please enter valid Application Id', 1)
    }
  }
}
