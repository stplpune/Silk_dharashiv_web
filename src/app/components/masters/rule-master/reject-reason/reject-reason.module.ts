import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RejectReasonRoutingModule } from './reject-reason-routing.module';
import { RejectReasonComponent } from './reject-reason.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AddRejectReasonComponent } from './add-reject-reason/add-reject-reason.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from 'src/app/shared/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    RejectReasonComponent,
    AddRejectReasonComponent
  ],
  imports: [
    CommonModule,
    RejectReasonRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    TranslateModule
  ]
})
export class RejectReasonModule { }
