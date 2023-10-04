import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockCircleRoutingModule } from './block-circle-routing.module';
import { BlockCircleComponent } from './block-circle.component';


@NgModule({
  declarations: [
    BlockCircleComponent
  ],
  imports: [
    CommonModule,
    BlockCircleRoutingModule
  ]
})
export class BlockCircleModule { }
