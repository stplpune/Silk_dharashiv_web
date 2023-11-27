import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  language: string = 'English';
  lag = ['English', 'Marathi'];
  selLang!: string;
  subscription!: Subscription;
  lang: string = 'English';
  
  constructor(private webStorage: WebStorageService,
    private translate: TranslateService) {
  }

  ngOnInit() {
   let language: any = sessionStorage.getItem('language');
    language = language ? language : 'English';
    // sessionStorage.setItem('language', language)
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.selLang = res;
    })
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }

  changeLanguage(lang: any) {
    this.language = lang
    this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
  }



}
