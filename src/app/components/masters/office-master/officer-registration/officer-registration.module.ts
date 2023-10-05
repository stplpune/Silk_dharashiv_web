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


@NgModule({
  declarations: [
    OfficerRegistrationComponent
  ],
  imports: [
    CommonModule,
    OfficerRegistrationRoutingModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class OfficerRegistrationModule { }
