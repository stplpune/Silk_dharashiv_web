import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Silk_dharashiv_web';

  constructor(private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) {
    this.checkBaseUrl();
    this.setGlobalTitle();
  }

  setGlobalTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),  // set title dynamic
    ).subscribe(() => {
      var rt = this.getActivatedRoute(this.activatedRoute);
      let titleName = rt?.data._value?.breadcrumb[rt.data?._value?.breadcrumb?.length - 1]?.title;
      rt.data.subscribe(() => {
        this.titleService.setTitle(titleName)
      })
    });
  }

  getActivatedRoute(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getActivatedRoute(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  checkBaseUrl() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0);
      }
    });
  }
}
