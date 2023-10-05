import { Component } from '@angular/core';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {

  displayedColumns: string[] = ['srno', 'departmentname', 'action'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  srno: number;
  departmentname: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { srno: 1, departmentname: 'Hydrogen', action: ' ' },
  { srno: 2, departmentname: 'Hydrogen', action: ' ' }
];
