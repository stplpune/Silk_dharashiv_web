import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-track-app',
  templateUrl: './track-app.component.html',
  styleUrls: ['./track-app.component.scss']
})
export class TrackAppComponent {
  applicationId: any;

  appId = new FormControl('', [Validators.required]);

  searchAppliation() {
    if (this.appId.status == 'VALID') {
      this.applicationId = this.appId.getRawValue()
    }
  }
}
