import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddSilkCocoonSellComponent } from './add-silk-cocoon-sell/add-silk-cocoon-sell.component';

@Component({
  selector: 'app-silk-cocoon-sell-list',
  templateUrl: './silk-cocoon-sell-list.component.html',
  styleUrls: ['./silk-cocoon-sell-list.component.scss']
})
export class SilkCocoonSellListComponent {

  constructor(private dialog: MatDialog) {}

  addsilkcacoon(){
    this.dialog.open(AddSilkCocoonSellComponent,{
      width:'50%'
    })
  }
}
