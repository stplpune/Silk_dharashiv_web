import { Component } from '@angular/core';
import { ChangePasswordComponent } from 'src/app/components/profile/change-password/change-password.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from 'src/app/components/profile/my-profile/my-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  language!: string;
  lag = ['English', 'Marathi']
  selLang!: string;
  loginData: any;
  userName: string = '';
  designationName: string = '';
  profileImg: string = '';
  subscription!: Subscription;
  setLang: any;
  breadCrumbData!: any;
  breadCrumbLabels!: string;
  getLangForLocalStor!: string | null | any;

  constructor(private webStorage: WebStorageService, public dialog: MatDialog,
    private commonMethods: CommonMethodsService, private router: Router,
    private translate: TranslateService) {

    localStorage.getItem('language') ? this.getLangForLocalStor = localStorage.getItem('language') : localStorage.setItem('language', 'English'); this.getLangForLocalStor = localStorage.getItem('language');
    this.translate.use(this.getLangForLocalStor)

  }

  ngOnInit() {
    this.loginData = this.webStorage.getLoggedInLocalstorageData();
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.setLang = res || localStorage.getItem('language') || 'English';
      this.setBreadCrumb();
    });
    this.translate.use(this.setLang);

    this.webStorage.getProfileData().subscribe((res: any) => {
      this.userName = res.name;
      this.designationName = res.designationName
      this.profileImg = res.profile;
    })

    this.webStorage.breadCrumbLabel.subscribe((res: any) => {
      this.breadCrumbLabels = res.split('/');
    });
  }

  setBreadCrumb() {
    this.webStorage.breadCrumbArray.subscribe((res: any) => this.breadCrumbData = res);
    let url = this.router.url.split('/');
    this.breadCrumbData.find((ele: any) => {
      if (ele.url == url[url.length - 1]) {
        let label = this.setLang == 'English' ? ele.breadCrumb : ele.m_breadCrumb;
        this.webStorage.breadCrumbLabel.next(label)
      }
    })
  }

  myprofile() {
    this.dialog.open(MyProfileComponent, {
      width: '500px'
    })
  }

  onClickSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }

  openChangePasswordDialog() {
    let dialoObj = {
      header: this.setLang == 'English' ? 'Change Password' : 'पासवर्ड बदला',
      title: this.setLang == 'English' ? 'Do You Really Want To Change Password?' : 'तुम्हाला खरच पासवर्ड बदलायचा आहे का?',
      cancelButton: this.setLang == 'English' ? 'Cancel' : 'रद्द करा',
      okButton: this.setLang == 'English' ? 'Change Password' : 'पासवर्ड बदला',
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
    localStorage.removeItem('silkDharashivUserInfo');
    this.commonMethods.routerLinkRedirect('/home');
  }

  openLogOutDialog() { //open logout dialog
    let dialoObj = {
      header: this.setLang == 'English' ? 'Logout' : 'बाहेर पडणे',
      title: this.setLang == 'English' ? 'Do You Want To Logout?' : 'आपण लॉगआउट करू इच्छिता',
      cancelButton: this.setLang == 'English' ? 'Cancel' : 'रद्द करा',
      okButton: this.setLang == 'English' ? 'Logout' : 'बाहेर पडणे',
      headerImage: 'assets/images/logout/logout@3x.png'
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
    localStorage.setItem('language', lang);
  }
}
