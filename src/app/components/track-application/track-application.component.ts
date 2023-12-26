import { Component, Inject, Optional, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
@Component({
  selector: 'app-track-application',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TranslateModule, DashPipe],
  templateUrl: './track-application.component.html',
  styleUrls: ['./track-application.component.scss']
})
export class TrackApplicationComponent {
  appHistoryArray: any;
  date = new Date();
  getBaseUrl!: string;
  @Input() childMessage: any;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  trackEndFlag: boolean = false

  constructor(
    private apiService: ApiService, private spinner: NgxSpinnerService, private commonMethods: CommonMethodsService, private error: ErrorHandlingService, private WebStorageService: WebStorageService,
    @Optional() public dialogRef: MatDialogRef<TrackApplicationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
    this.getBaseUrl = this.router.url;
    this.router.url != '/track-application' ? this.getAppHistory(data.applicationNo) : '';

    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }

  ngOnChanges(): void {
    this.router.url == '/track-application' && this.childMessage ? this.getAppHistory(this.childMessage) : this.appHistoryArray = [];
  }

  getAppHistory(id: any) {
    this.spinner.show();
    this.apiService?.setHttp('get', 'sericulture/api/ApprovalMaster/GetApprovalHistoryDetails?ApplicationNo=' + id, false, false, false, 'baseUrl');
    this.apiService?.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.appHistoryArray = res.responseData;
        this.trackEndFlag = this.appHistoryArray.every((ele: any) => ele.status == 'Approved');
        this.spinner.hide();
      }
      else {
        this.appHistoryArray = [];
        this.spinner.hide();
        this.commonMethods.snackBar(res.statusMessage, 1)
      }
    }, (error: any) => {
      this.spinner.hide();
      this.error.handelError(error.status);
    })
  }

}
