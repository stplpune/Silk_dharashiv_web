import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSamgraAppRoutingModule } from './create-samgra-app-routing.module';
import { CreateSamgraAppComponent } from './create-samgra-app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatStepperModule} from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AddDetailsComponent } from './add-details/add-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CreateSamgraAppComponent,
    AddDetailsComponent
  ],
  imports: [
    CommonModule,
    CreateSamgraAppRoutingModule,
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
    MatStepperModule,
    MatDatepickerModule,        // <----- import(must)
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    DashPipe,
    TranslateModule
  ]
})
export class CreateSamgraAppModule { }
