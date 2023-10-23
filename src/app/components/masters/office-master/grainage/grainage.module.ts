import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrainageRoutingModule } from './grainage-routing.module';
import { GrainageComponent } from './grainage.component';


@NgModule({
  declarations: [
    GrainageComponent
  ],
  imports: [
    CommonModule,
    GrainageRoutingModule
  ]
})
export class GrainageModule { }
