import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SilkSamgraRoutingModule } from './silk-samgra-routing.module';
import { SilkSamgraComponent } from './silk-samgra.component';


@NgModule({
  declarations: [
    SilkSamgraComponent
  ],
  imports: [
    CommonModule,
    SilkSamgraRoutingModule
  ]
})
export class SilkSamgraModule { }
