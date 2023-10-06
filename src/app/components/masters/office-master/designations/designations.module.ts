import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { DesignationsRoutingModule } from './designations-routing.module';
import { DesignationsComponent } from './designations.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GlobalTableComponent } from 'src/app/shared/global-table/global-table.component';


@NgModule({
  declarations: [
    DesignationsComponent
  ],
  imports: [
    CommonModule,
    DesignationsRoutingModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    GlobalTableComponent
  ]
})
export class DesignationsModule { }
