import { Component } from '@angular/core';

@Component({
  selector: 'app-set-rule-modal',
  templateUrl: './set-rule-modal.component.html',
  styleUrls: ['./set-rule-modal.component.scss']
})
export class SetRuleModalComponent {

  displayedColumns: string[] = ['srno', 'action', 'departmentlevel', 'designation','order'];
  dataSource = ELEMENT_DATA;

}
export interface PeriodicElement {
  srno: number;
  action: string;
  departmentlevel: string;
  designation: string;
  order:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, action: 'Application Review', departmentlevel: 'Village Level', designation: 'Gram Sevak',order:'1'}
];
