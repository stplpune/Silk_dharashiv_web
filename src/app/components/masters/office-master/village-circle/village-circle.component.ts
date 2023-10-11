import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddVillageComponent } from './add-village/add-village.component';

@Component({
  selector: 'app-village-circle',
  templateUrl: './village-circle.component.html',
  styleUrls: ['./village-circle.component.scss']
})
export class VillageCircleComponent {
  constructor(public dialog: MatDialog) {}

  
  AddVillage(data?:any) {
      const dialogRef = this.dialog.open(AddVillageComponent, {
        width: '700px',
        data: data,
        disableClose: true
          });
  
      dialogRef.afterClosed().subscribe(() => {
        dialogRef.close();
      })
  }
    
  }

