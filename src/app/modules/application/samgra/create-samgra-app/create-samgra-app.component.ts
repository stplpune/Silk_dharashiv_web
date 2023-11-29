import { Component } from '@angular/core';
import { AddDetailsComponent } from './add-details/add-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-samgra-app',
  templateUrl: './create-samgra-app.component.html',
  styleUrls: ['./create-samgra-app.component.scss']
})
export class CreateSamgraAppComponent {

  constructor(public dialog: MatDialog) {}

  adddetails(){
    this.dialog.open(AddDetailsComponent,{
      width:'50%'
    })
  }

  displayedColumns: string[] = ['srno', 'cropname', 'area', 'doneProdQuintal', 'recievedpriceperkg','doneProductionQty','recievedcost','doneproductionRs','perekarprodRs'];
  dataSource = ELEMENT_DATA;
}

export interface PeriodicElement {
  srno: number;
  cropname: string;
  area: string;
  doneProdQuintal: string;
  recievedpriceperkg :string;
  doneProductionQty:string;
  recievedcost:string;
  doneproductionRs:string;
  perekarprodRs:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, cropname: 'Hydrogen', area: '1', doneProdQuintal: '8',recievedpriceperkg:'120', doneProductionQty:'960000', recievedcost:'15000', doneproductionRs:'81000',perekarprodRs:'40500'   }
];
