import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManaregaRoutingModule } from './manarega-routing.module';
import { ManaregaComponent } from './manarega.component';


@NgModule({
  declarations: [
    ManaregaComponent
  ],
  imports: [
    CommonModule,
    ManaregaRoutingModule
  ]
})
export class ManaregaModule { }
