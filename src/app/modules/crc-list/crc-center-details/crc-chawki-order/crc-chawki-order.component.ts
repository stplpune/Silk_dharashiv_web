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
import { ChowkiOrderDetailsComponent } from './chowki-order-details/chowki-order-details.component';


@Component({
  selector: 'app-crc-chawki-order',
  standalone: true,
  imports: [CommonModule,  MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule],
  templateUrl: './crc-chawki-order.component.html',
  styleUrls: ['./crc-chawki-order.component.scss']
})
export class CrcChawkiOrderComponent {

  constructor(public dialog:MatDialog) {}

  chowkiorderdetails(){
    this.dialog.open(ChowkiOrderDetailsComponent,{
      width:'90%'
    })
  }
}
