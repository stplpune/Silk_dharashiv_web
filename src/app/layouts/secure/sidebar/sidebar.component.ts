import { Component } from '@angular/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent {
  constructor(private webStorage: WebStorageService) {

  }

  onCloseSidebar() {
    this.webStorage.setSidebarState(!this.webStorage.getSidebarState());
  }
}
