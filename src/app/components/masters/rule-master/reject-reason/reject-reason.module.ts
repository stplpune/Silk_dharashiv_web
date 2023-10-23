import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RejectReasonRoutingModule } from './reject-reason-routing.module';
import { RejectReasonComponent } from './reject-reason.component';


@NgModule({
  declarations: [
    RejectReasonComponent
  ],
  imports: [
    CommonModule,
    RejectReasonRoutingModule
  ]
})
export class RejectReasonModule { }
