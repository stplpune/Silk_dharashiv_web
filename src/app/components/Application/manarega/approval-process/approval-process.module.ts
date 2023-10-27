import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalProcessRoutingModule } from './approval-process-routing.module';
import { ApprovalProcessComponent } from './approval-process.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddDocumentsComponent } from './add-documents/add-documents.component';


@NgModule({
  declarations: [
    ApprovalProcessComponent,
    AddDocumentsComponent,
  ],
  imports: [
    CommonModule,
    ApprovalProcessRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
  ]
})
export class ApprovalProcessModule { }
