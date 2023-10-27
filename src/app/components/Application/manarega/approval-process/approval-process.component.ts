import { Component } from '@angular/core';
import { AddDocumentsComponent } from './add-documents/add-documents.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent {
  constructor(public dialog: MatDialog) {}

  adddocuments(){
    this.dialog.open(AddDocumentsComponent,{
      width:'40%'
    })
  }

  // viewdetails(){
  //   this.dialog.open(ViewDetailsComponent,{
  //     width:'80%'
  //   })
  // }
}
