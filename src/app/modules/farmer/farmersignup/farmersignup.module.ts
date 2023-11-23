import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmersignupRoutingModule } from './farmersignup-routing.module';
import { FarmersignupComponent } from './farmersignup.component';


@NgModule({
  declarations: [
    FarmersignupComponent
  ],
  imports: [
    CommonModule,
    FarmersignupRoutingModule
  ]
})
export class FarmersignupModule { }
