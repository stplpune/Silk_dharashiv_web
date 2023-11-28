import { Component } from '@angular/core';
import { ChangePasswordComponent } from 'src/app/components/profile/change-password/change-password.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
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
  profileImg: string = '';
  subscription!: Subscription;
  setLang: any;

  getLangForLocalStor!: string | null | any;

  constructor(private webStorage: WebStorageService, public dialog: MatDialog,
    private commonMethods: CommonMethodsService,
    private translate: TranslateService) {

    localStorage.getItem('language') ? this.getLangForLocalStor = localStorage.getItem('language') : localStorage.setItem('language', 'English'); this.getLangForLocalStor = localStorage.getItem('lang');
    this.translate.use(this.getLangForLocalStor)

  }

  ngOnInit() {
    this.loginData = this.webStorage.getLoggedInLocalstorageData();
    // let language: any = localStorage.getItem('language');
    // language = language ? language : 'English';
    // this.webStorage.setLanguage.next(language);
    // this.translate.use(language);

    // this.webStorage.setLanguage.subscribe((res: any) => {
    //   this.setLang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
    // });

    // this.setLang = localStorage.getItem('language') ? localStorage.getItem('language') : 'English';

    const language = localStorage.getItem('language') || 'English';
     this.translate.use(language);
     this.webStorage.setLanguage.subscribe((res: any) => {
      this.setLang = res || localStorage.getItem('language') || 'English';
    });
    this.setLang = language;


    this.webStorage.getProfileData().subscribe((res: any) => {
      this.userName = res.name;
      this.designationName = res.designationName
      this.profileImg = res.profile;
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
      header: this.setLang == 'en' ? 'Change Password' : 'पासवर्ड बदला',
      title: this.setLang == 'en' ? 'Do You Really Want To Change Password?' : 'तुम्हाला खरच पासवर्ड बदलायचा आहे का?',
      cancelButton: this.setLang == 'en' ? 'Cancel' : 'रद्द करा',
      okButton: this.setLang == 'en' ? 'Change Password' : 'पासवर्ड बदला',
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
    this.commonMethods.routerLinkRedirect('/login');
  }

  openLogOutDialog() {    //open logout dialog
    let dialoObj = {
      header: this.setLang == 'en' ? 'Logout' : 'बाहेर पडणे',
      title: this.setLang == 'en' ? 'Do You Want To Logout?' : 'आपण लॉगआउट करू इच्छिता',
      cancelButton: this.setLang == 'en' ? 'Cancel' : 'रद्द करा',
      okButton: this.setLang == 'en' ? 'Logout' : 'बाहेर पडणे',
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
    localStorage.setItem('language', lang)
  }
}
