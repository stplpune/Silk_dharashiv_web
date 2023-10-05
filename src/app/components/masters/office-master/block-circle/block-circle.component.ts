import { Component } from '@angular/core';

@Component({
  selector: 'app-block-circle',
  templateUrl: './block-circle.component.html',
  styleUrls: ['./block-circle.component.scss']
})
export class BlockCircleComponent {


  displayedColumns: string[] = ['srno', 'type','blockcirclename', 'action'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  srno: number;
  type: string;
  blockcirclename: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, type: 'Hydrogen', blockcirclename:'District Level', action: ' '},
  {srno: 2, type: 'Hydrogen', blockcirclename:'Taluka Level', action: ' '}
];
