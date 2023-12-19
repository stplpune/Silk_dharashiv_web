import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent {

  hideHeaderFooter: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof (NavigationEnd || NavigationStart)) {
        if (event.url == '/login' || event.url == '/forgot-password' || event.url == '/farmer-signup' || event.url == '/farmer-login' || event.url.split('?')[0]  == '/farmer-signup'   || event.url.split('?')[0]  == '/farmer-login') {
          this.hideHeaderFooter = false;
        } else {
          this.hideHeaderFooter = true;
        }
      }
    });
  }

}
