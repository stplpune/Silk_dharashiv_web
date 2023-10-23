import { Component } from '@angular/core';
import { AddGrainageComponent } from './add-grainage/add-grainage.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-grainage',
  templateUrl: './grainage.component.html',
  styleUrls: ['./grainage.component.scss']
})
export class GrainageComponent {
  constructor(public dialog: MatDialog) {}

  addgrainage(){
    this.dialog.open(AddGrainageComponent,{
      width:'60%'
    })
  }
}
