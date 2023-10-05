import { Component } from '@angular/core';

@Component({
  selector: 'app-department-levels',
  templateUrl: './department-levels.component.html',
  styleUrls: ['./department-levels.component.scss']
})
export class DepartmentLevelsComponent {

  displayedColumns: string[] = ['srno', 'departmentname','level', 'action'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  srno: number;
  departmentname: string;
  level: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, departmentname: 'Hydrogen', level:'District Level', action: ' '},
  {srno: 2, departmentname: 'Hydrogen', level:'Taluka Level', action: ' '}
];
