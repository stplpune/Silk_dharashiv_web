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


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  language: string = 'English'
  lag = ['English', 'Marathi']
  selLang!: string;

  constructor(private webStorage: WebStorageService, public dialog: MatDialog,
    private commonMethods: CommonMethodsService,
    private translate: TranslateService) {
  }

  ngOnInit(){
    let language: any = sessionStorage.getItem('language');
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.selLang = res;
    })
  }


  myprofile(){
    this.dialog.open(MyProfileComponent,{
      width:'40%'
    })
  }

  onClickSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }

  openChangePasswordDialog() {
    let dialoObj = {
      header: 'Change Password',
      title: 'Do You Really Want To Change Password?',
      cancelButton: 'Cancel',
      okButton: 'Change Password'
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
      header: 'Logout',
      title: 'Do You Want To Logout ?',
      cancelButton: 'Cancel',
      okButton: 'Logout'
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
