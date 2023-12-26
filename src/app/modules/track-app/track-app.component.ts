import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(public validation: ValidationService, private commonMethods: CommonMethodsService, 
    private WebStorageService: WebStorageService, public router: Router, public translate: TranslateService) {
  }


  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }

  searchAppliation(label?: string) {
    if (label) {
      this.applicationId = '';
      this.appId.setValue('');
      this.appId.markAsUntouched();
      return
    } else {
      if (this.appId.status == 'VALID') {
        this.applicationId = this.appId.getRawValue()
      } else {
        this.commonMethods.snackBar(this.lang == 'en' ? 'Please enter valid Application Id' : 'कृपया वैध अर्ज आयडी प्रविष्ट करा', 1)
      }
    }
  }
}
