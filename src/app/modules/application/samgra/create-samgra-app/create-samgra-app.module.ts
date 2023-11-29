import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSamgraAppRoutingModule } from './create-samgra-app-routing.module';
import { CreateSamgraAppComponent } from './create-samgra-app.component';


@NgModule({
  declarations: [
    CreateSamgraAppComponent
  ],
  imports: [
    CommonModule,
    CreateSamgraAppRoutingModule
  ]
})
export class CreateSamgraAppModule { }
