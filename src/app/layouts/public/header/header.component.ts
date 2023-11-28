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
  // lang: string = 'English';
  getLangForLocalStor!: string | null | any;
  setLang: any;

  constructor(private webStorage: WebStorageService,
    private translate: TranslateService) {
      localStorage.getItem('language') ? this.getLangForLocalStor = localStorage.getItem('language') : localStorage.setItem('language', 'English'); this.getLangForLocalStor = localStorage.getItem('language');
      this.translate.use(this.getLangForLocalStor)
  }

  ngOnInit() {
    let language: any = localStorage.getItem('language');
    language = language ? language : 'English';
    // sessionStorage.setItem('language', language)
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.setLang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
    });

    this.setLang = localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
  }

  changeLanguage(lang: any) {
    this.language = lang
    this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    localStorage.setItem('language', lang)
  }



}
