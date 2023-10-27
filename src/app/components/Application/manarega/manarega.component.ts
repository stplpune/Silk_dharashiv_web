import { Component } from '@angular/core';

@Component({
  selector: 'app-manarega',
  templateUrl: './manarega.component.html',
  styleUrls: ['./manarega.component.scss']
})
export class ManaregaComponent {
  displayedColumns: string[] = ['srno', 'applicationid', 'farmername', 'mobileno','taluka','village','date','status','action'];
  dataSource = ELEMENT_DATA;

}
export interface PeriodicElement {
  srno: number;
  applicationid: string;
  farmername: string;
  mobileno: string;
  taluka:string;
  village:string;
  date:string;
  status:string;
  action:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, applicationid: 'MR0008576253', farmername: 'Jayaram Ramesh Tandale', mobileno: '8669264767', taluka:'Havelli',village:'Nagar', date:'25-10-2023', status:'Pending', action:'View' }
];
