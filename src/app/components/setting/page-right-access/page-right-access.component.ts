import { Component } from '@angular/core';
export interface PeriodicElement {
  srno: any;
  PageName: any;
  PageURL: any;
  Select: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1,PageName: 'Designation Registration', PageURL: 'designation-registration', Select: ''},
  {srno: 2, PageName: 'School Registration', PageURL: 'school-registration', Select: ''},
  {srno: 3, PageName: 'Page Right Access', PageURL: 'page-right-access', Select: '',},
];
@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent {
  displayedColumns: string[] = ['srno', 'PageName', 'PageURL', 'Select'];
  dataSource = ELEMENT_DATA;
}
