import { Component } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {


  displayedColumns: string[] = ['srno', 'schemename', 'actionname', 'description','status','action'];
  dataSource = ELEMENT_DATA;

}
export interface PeriodicElement {
  srno: number;
  schemename: string;
  actionname: string;
  description: string;
  status: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, schemename: 'Hydrogen', actionname: 'Maharashtra', description: 'H',status:'Active',action:''   }
];
