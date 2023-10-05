import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficerRegistrationRoutingModule } from './officer-registration-routing.module';
import { OfficerRegistrationComponent } from './officer-registration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RegisterOfficerComponent } from './register-officer/register-officer.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    OfficerRegistrationComponent,
    RegisterOfficerComponent
  ],
  imports: [
    CommonModule,
    OfficerRegistrationRoutingModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class OfficerRegistrationModule { }
