import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GrainageOrderDetailsComponent } from './grainage-order-details/grainage-order-details.component';

@Component({
  selector: 'app-crc-grainage-order',
  standalone: true,
  imports: [CommonModule,  MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule],
  templateUrl: './crc-grainage-order.component.html',
  styleUrls: ['./crc-grainage-order.component.scss']
})
export class CrcGrainageOrderComponent {
  constructor(public dialog:MatDialog) {}


  grainageorderdetails(){
    this.dialog.open(GrainageOrderDetailsComponent,{
      width:"90%"
    })
  }
}
