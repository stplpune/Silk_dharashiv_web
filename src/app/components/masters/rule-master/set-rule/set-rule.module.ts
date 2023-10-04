import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetRuleRoutingModule } from './set-rule-routing.module';
import { SetRuleComponent } from './set-rule.component';


@NgModule({
  declarations: [
    SetRuleComponent
  ],
  imports: [
    CommonModule,
    SetRuleRoutingModule
  ]
})
export class SetRuleModule { }
