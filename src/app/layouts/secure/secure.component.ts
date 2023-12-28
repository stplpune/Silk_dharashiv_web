import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent {

  lang: any;

  constructor(private webStorage: WebStorageService, private router: Router) {

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })

    this.router.events.subscribe((event: any) => {
      if (event instanceof (NavigationEnd || NavigationStart)) {
        let breadCrumbData: any;
        this.webStorage.breadCrumbArray.subscribe((res: any) => breadCrumbData = res);
        let url = this.router.url.split('/');
        breadCrumbData.find((ele: any) => {
          if (ele.url == url[url.length - 1]) {
            let label = this.lang == 'en' ? ele.breadCrumb : ele.m_breadCrumb;
            this.webStorage.breadCrumbLabel.next(label)
          }
        })
      }
    });
  }

  getSideBarState() {
    return this.webStorage.getSidebarState();
  }
}
