import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crc-center-details',
  templateUrl: './crc-center-details.component.html',
  styleUrls: ['./crc-center-details.component.scss'],
  // template: '<app-crc-profile [dataFromParent]="parentData"></app-crc-profile>',
})
export class CrcCenterDetailsComponent {
  routingData:any;
  constructor
  (
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(){
    this.route.queryParams.subscribe((params:any) => {
      this.routingData = params?.data;
    });
  }

  backToPage(){
    this.router.navigate(['crc-list'])
  }
}
