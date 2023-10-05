import { Component } from '@angular/core';
import { ChangePasswordComponent } from 'src/app/components/profile/change-password/change-password.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private webStorage: WebStorageService, public dialog: MatDialog) {

  }


  onClickSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent, {
      width: '50%'
    });
  }

}
