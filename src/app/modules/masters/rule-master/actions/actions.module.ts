import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionsRoutingModule } from './actions-routing.module';
import { ActionsComponent } from './actions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddActionComponent } from './add-action/add-action.component';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [
    ActionsComponent,
    AddActionComponent
  ],
  imports: [
    CommonModule,
    ActionsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    TranslateModule
  ]
})
export class ActionsModule { }
