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
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [
    DesignationsComponent,
    AddDesignationComponent
  ],
  imports: [
    CommonModule,
    DesignationsRoutingModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    GlobalTableComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ]
})
export class DesignationsModule { }
