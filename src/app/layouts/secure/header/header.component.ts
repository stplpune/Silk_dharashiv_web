import { Component } from '@angular/core';
import { ChangePasswordComponent } from 'src/app/components/profile/change-password/change-password.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { TranslateService } from '@ngx-translate/core'
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from 'src/app/components/profile/my-profile/my-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  language: string = 'English'
  lag = ['English', 'Marathi']
  selLang!: string;
  loginData: any;
  userName: string = '';
  designationName: string = '';
  subscription!: Subscription;
  lang: string = 'English';


  constructor(private webStorage: WebStorageService, public dialog: MatDialog,
    private commonMethods: CommonMethodsService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.loginData = this.webStorage.getLoggedInLocalstorageData();
    let language: any = sessionStorage.getItem('language');
    language = language ? language : 'English';
    // sessionStorage.setItem('language', language)
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.selLang = res;
    })
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })

    this.webStorage.getProfileData().subscribe((res: any) => {
      this.userName = res.name;
      this.designationName = res.designationName
    })
  }


  myprofile() {
    this.dialog.open(MyProfileComponent, {
      width: '70%'
    })
  }

  onClickSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }

  openChangePasswordDialog() {
    let dialoObj = {
      header:this.lang == 'en' ?  'Change Password' : 'पासवर्ड बदला',
      title:this.lang == 'en' ?  'Do You Really Want To Change Password?' : 'तुम्हाला खरच पासवर्ड बदलायचा आहे का?',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
      okButton:this.lang == 'en' ?  'Change Password' : 'पासवर्ड बदला',
    }
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '50%',
      data: dialoObj,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.clearLocalStorage();
      }
    });
  }


  clearLocalStorage() {
    localStorage.clear();
    sessionStorage.removeItem('loggedIn');
    this.commonMethods.routerLinkRedirect('/login');
  }

  openLogOutDialog() {    //open logout dialog
    let dialoObj = {
      header:this.lang == 'en' ? 'Logout' : 'बाहेर पडणे',
      title: this.lang == 'en' ?  'Do You Want To Logout?' : 'आपण लॉगआउट करू इच्छिता',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
      okButton:this.lang == 'en' ? 'Logout' : 'बाहेर पडणे'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '300px',
      data: dialoObj,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.clearLocalStorage();
      }
    });
  }


  changeLanguage(lang: any) {
    this.language = lang
    this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
  }




}
