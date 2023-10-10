import { Component } from '@angular/core';
import { ChangePasswordComponent } from 'src/app/components/profile/change-password/change-password.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MyProfileComponent } from 'src/app/components/profile/my-profile/my-profile.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private webStorage: WebStorageService, public dialog: MatDialog,
    private commonMethods: CommonMethodsService) {

  }

  myprofile(){
    this.dialog.open(MyProfileComponent,{
      width:'50%'
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

}
