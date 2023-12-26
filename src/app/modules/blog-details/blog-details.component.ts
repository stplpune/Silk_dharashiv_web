import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent {
  blogId: any;
  blogDetails = new Array();
  allBlogDetails = new Array();
  length: number = 0;
  currentPage: number = 0;
  constructor(private activatedRoute: ActivatedRoute, public encryptDecryptService: AesencryptDecryptService,
    private spinner: NgxSpinnerService, private apiService: ApiService) {
    let paramData: any = this.activatedRoute.snapshot.queryParams; this.blogId = this.encryptDecryptService?.decrypt(paramData?.id).toString();
  }

  ngOnInit() {
    this.getBlogsDetailsById();
    this.getAllBlogs();
  }

  getBlogsDetailsById(id ?:any, flag? : string) {
    let url = `sericulture/api/Blogs/get-blogs-details?blogId=${flag ? id :  this.blogId}`;
    this.spinner.show();
    this.apiService.setHttp('GET', url, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.blogDetails = res.responseData.responseData1 : this.blogDetails = [];
        this.spinner.hide();
      },
      error: () => { this.blogDetails = []; this.spinner.hide(); }
    })
  }

  getAllBlogs() {
    let url = `sericulture/api/Blogs/get-blogs-details?SeacrhText=&PageNo=${this.currentPage + 1}&PageSize=5&lan=en`;
    this.spinner.show();
    this.apiService.setHttp('GET', url, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? (this.allBlogDetails = res.responseData.responseData1, this.length = res.responseData.responseData2.totalCount) : this.allBlogDetails = [];
        this.spinner.hide();
      },
      error: () => { this.allBlogDetails = []; this.spinner.hide(); }
    })
  }

  change(event: any) {
    this.currentPage = event.pageIndex;
    this.getAllBlogs();
  }
}
