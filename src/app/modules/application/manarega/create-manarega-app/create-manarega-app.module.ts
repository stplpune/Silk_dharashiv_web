import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateManaregaAppRoutingModule } from './create-manarega-app-routing.module';
import { CreateManaregaAppComponent } from './create-manarega-app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';

@NgModule({
  declarations: [
    CreateManaregaAppComponent
  ],
  imports: [
    CommonModule,
    CreateManaregaAppRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatSelectSearchModule,
    TranslateModule,
    MatTooltipModule,
    DashPipe
  ]
})
export class CreateManaregaAppModule { }
