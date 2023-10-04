import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficerRegistrationRoutingModule } from './officer-registration-routing.module';
import { OfficerRegistrationComponent } from './officer-registration.component';


@NgModule({
  declarations: [
    OfficerRegistrationComponent
  ],
  imports: [
    CommonModule,
    OfficerRegistrationRoutingModule
  ]
})
export class OfficerRegistrationModule { }
