import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-track-app',
  templateUrl: './track-app.component.html',
  styleUrls: ['./track-app.component.scss']
})
export class TrackAppComponent {
  applicationId: any;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  appId = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(6), Validators.pattern(this.validation?.alphaNumericWithoutSpace)]);
   constructor(public validation: ValidationService, private commonMethods: CommonMethodsService,private WebStorageService: WebStorageService) {}

 
  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }

  searchAppliation() {
    if (this.appId.status == 'VALID') {
      this.applicationId = this.appId.getRawValue()
    }else{
      this.commonMethods.snackBar('Please enter valid Application Id', 1)
    }
  }
}
