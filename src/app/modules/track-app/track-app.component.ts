import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-track-app',
  templateUrl: './track-app.component.html',
  styleUrls: ['./track-app.component.scss']
})
export class TrackAppComponent {
  applicationId: any;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  appId = new FormControl('', [Validators.required]);

  constructor( private WebStorageService: WebStorageService){}

  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }

  searchAppliation() {
    if (this.appId.status == 'VALID') {
      this.applicationId = this.appId.getRawValue()
    }
  }
}
