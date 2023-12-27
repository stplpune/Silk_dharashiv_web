import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ApiService } from 'src/app/core/services/api.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  getAppCountData = new Array();
  blogDetails = new Array();
  subscription!: Subscription;
  lang: any;
  constructor(private apiService: ApiService, private router: Router, public encryptDecryptService: AesencryptDecryptService,  private WebStorageService: WebStorageService,) { 
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
    this.lang = res 
    })
   // this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    
  }

  ngOnInit() {
    this.getTotalCount();
    this.getBlogsDetails();
  }

  getTotalCount() {
    let url = `sericulture/api/Action/GetOfficerDashboard?&SchemeTypeId=0&DistrictId=1&TalukaId=0&GrampanchayatId=0&UserId=1&actionId=0&lan=${this.lang}`;
    this.apiService.setHttp('GET', url, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.getAppCountData.push(res.responseData) : this.getAppCountData = [];
      },
      error: () => { this.getAppCountData = [] }
    })
  }

  getBlogsDetails() {
    let url = `sericulture/api/Blogs/get-blogs-details?SeacrhText=&PageNo=1&PageSize=10&lan=${this.lang}`;
    this.apiService.setHttp('GET', url, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.blogDetails = res.responseData.responseData1.slice(0, 4) : this.blogDetails = [];
      },
      error: () => { this.blogDetails = [] }
    })
  }

  redTo(data: any) {
    this.router.navigate(['blog-details'], { queryParams: { id: this.encryptDecryptService.encrypt(data.id.toString()) } });
  }
}
