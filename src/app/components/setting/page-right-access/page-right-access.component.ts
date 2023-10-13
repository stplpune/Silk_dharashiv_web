import { Component } from '@angular/core';
export interface PeriodicElement {
  srno: any;
  PageName: any;
  PageURL: any;
  Read:any;
  Write:any;
  Delete:any;
  All:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1,PageName: 'Designation Registration', PageURL: 'designation-registration',Read:'',Write:'',Delete:'',All:''},
  {srno: 2, PageName: 'School Registration', PageURL: 'school-registration',Read:'',  Write:'',Delete:'',All:''},
  {srno: 3, PageName: 'Page Right Access', PageURL: 'page-right-access',Read:'',  Write:'',Delete:'',All:''},
];
@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent {
  displayedColumns: string[] = ['srno', 'PageName', 'PageURL','Read','Write','Delete','All'];
  dataSource = ELEMENT_DATA;
}
