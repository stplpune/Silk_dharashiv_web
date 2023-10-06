import { Component } from '@angular/core';
import { AddMarketListComponent } from './add-market-list/add-market-list.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent {

  constructor(public dialog: MatDialog) {}

  addmarketlist(){
    this.dialog.open(AddMarketListComponent,{
      width:'50%'
    })
  }


}
