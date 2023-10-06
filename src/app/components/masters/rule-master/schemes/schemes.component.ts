import { Component } from '@angular/core';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent {

  displayedColumns: string[] = ['srno', 'schemename', 'state', 'district','status','action'];
  dataSource = ELEMENT_DATA;
}
export interface PeriodicElement {
  srno: number;
  schemename: string;
  state: string;
  district: string;
  status: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, schemename: 'Hydrogen', state: 'Maharashtra', district: 'H',status:'Active',action:''   }
];
