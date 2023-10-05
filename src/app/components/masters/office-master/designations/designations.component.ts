import { Component } from '@angular/core';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent {
  displayedColumns: string[] = ['srno', 'departmentname','level','designation', 'action'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  srno: number;
  departmentname: string;
  level: string;
  designation: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, departmentname: 'Hydrogen', level:'District Level', designation:'Silk Development Officer' ,action: ' '},
  {srno: 2, departmentname: 'Hydrogen', level:'Taluka Level', designation:'Technical Assistant', action: ' '}
];
