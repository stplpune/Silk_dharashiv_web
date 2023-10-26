import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalProcessRoutingModule } from './approval-process-routing.module';
import { ApprovalProcessComponent } from './approval-process.component';


@NgModule({
  declarations: [
    ApprovalProcessComponent
  ],
  imports: [
    CommonModule,
    ApprovalProcessRoutingModule
  ]
})
export class ApprovalProcessModule { }
