import { Component } from '@angular/core';
import { RegisterOfficerComponent } from './register-officer/register-officer.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-officer-registration',
  templateUrl: './officer-registration.component.html',
  styleUrls: ['./officer-registration.component.scss']
})
export class OfficerRegistrationComponent {
  constructor(public dialog: MatDialog) {}

  displayedColumns: string[] = ['srno', 'officername','mobileno', 'emailid','designation','department','level','status','action'];
  dataSource = ELEMENT_DATA;



  registerofficer(){
    this.dialog.open(RegisterOfficerComponent,{
      width:'50%'
    });
  }

}

export interface PeriodicElement {
  srno: number;
  officername: string;
  mobileno: string;
  emailid: string;
  designation: string;
  department: string;
  level: string;
  status:string;
  action:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, officername: 'Hydrogen', mobileno:'District Level', emailid: 'abs@gmail..com', designation:'Sericulture',department:'Silk Develpment Officer', level:'District Level',status:'Active', action:''   },
];
