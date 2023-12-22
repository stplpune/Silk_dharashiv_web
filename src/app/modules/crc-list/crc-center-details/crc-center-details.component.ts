import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-crc-center-details',
  templateUrl: './crc-center-details.component.html',
  styleUrls: ['./crc-center-details.component.scss'],
  // template: '<app-crc-profile [dataFromParent]="parentData"></app-crc-profile>',
})
export class CrcCenterDetailsComponent {
  routingData:any;
  subscription!: Subscription;
  lang: string = 'English';
  constructor
  (
    private route: ActivatedRoute,
    private router:Router,
    private WebStorageService:WebStorageService 
  ) {}

  ngOnInit(){
   this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
    this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
    this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
  })
    this.route.queryParams.subscribe((params:any) => {
      this.routingData = params?.data;
    });
  }

  backToPage(){
    this.router.navigate(['crc-list'])
  }
}
