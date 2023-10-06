import { Component } from '@angular/core';
import { AddcircleComponent } from './addcircle/addcircle.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-block-circle',
  templateUrl: './block-circle.component.html',
  styleUrls: ['./block-circle.component.scss']
})
export class BlockCircleComponent {
  constructor(public dialog: MatDialog) {}

  displayedColumns: string[] = ['srno', 'type','blockcirclename', 'action'];
  dataSource = ELEMENT_DATA;


  addcircle(){
    this.dialog.open(AddcircleComponent,{
      width:'50%'
    })
  }

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
