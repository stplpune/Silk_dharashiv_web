import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetRuleRoutingModule } from './set-rule-routing.module';
import { SetRuleComponent } from './set-rule.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SetRuleModalComponent } from './set-rule-modal/set-rule-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [
    SetRuleComponent,
    SetRuleModalComponent
  ],
  imports: [
    CommonModule,
    SetRuleRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    TranslateModule,
    MatCheckboxModule
  ]
})
export class SetRuleModule { }
