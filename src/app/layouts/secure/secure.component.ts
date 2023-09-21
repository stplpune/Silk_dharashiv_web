import { Component } from '@angular/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent {
  constructor(private webStorage: WebStorageService) {

  }

  getSideBarState() {
    return this.webStorage.getSidebarState();
  }
}
