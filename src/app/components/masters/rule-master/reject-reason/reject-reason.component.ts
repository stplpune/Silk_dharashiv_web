import { Component } from '@angular/core';
import { AddRejectReasonComponent } from './add-reject-reason/add-reject-reason.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.scss']
})
export class RejectReasonComponent {
  constructor(public dialog: MatDialog) {}

  addrejectreason(){
    this.dialog.open(AddRejectReasonComponent,{
      width:'40%'
    })
  }
}
