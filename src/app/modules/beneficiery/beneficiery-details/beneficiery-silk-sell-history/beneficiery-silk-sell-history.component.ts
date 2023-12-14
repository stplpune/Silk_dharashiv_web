import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SilkSellDetailsComponent } from './silk-sell-details/silk-sell-details.component';

@Component({
  selector: 'app-beneficiery-silk-sell-history',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './beneficiery-silk-sell-history.component.html',
  styleUrls: ['./beneficiery-silk-sell-history.component.scss']
})
export class BeneficierySilkSellHistoryComponent {

  constructor(public dialog:MatDialog) {}

  silkselldetails(){
    this.dialog.open(SilkSellDetailsComponent,{
      width:"90%"
    })
  }
}
