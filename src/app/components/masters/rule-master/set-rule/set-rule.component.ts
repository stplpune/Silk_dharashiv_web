import { Component } from '@angular/core';
import { SetRuleModalComponent } from './set-rule-modal/set-rule-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-set-rule',
  templateUrl: './set-rule.component.html',
  styleUrls: ['./set-rule.component.scss']
})
export class SetRuleComponent {
  constructor(public dialog: MatDialog) {}

displayedColumns: string[] = ['srno', 'scheme', 'department', 'action'];
dataSource = ELEMENT_DATA;


setrules(){
  this.dialog.open(SetRuleModalComponent,{
    width:'65%'
  })
}

}
export interface PeriodicElement {
srno: number;
scheme: string;
department: string;
action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
{srno: 1, scheme: 'Manarega', department: 'Agriculture',action:''   }
];
