import { Component } from '@angular/core';
import { AadhaarNoValComponent } from './aadhaar-no-val/aadhaar-no-val.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss']
})
export class FarmerDashboardComponent {

  constructor(public dialog: MatDialog) { }

  aadhaarNoVal(schemeId: any) {
    this.dialog.open(AadhaarNoValComponent, {
      width: '500px',
      data: schemeId,
    });
  }
}
