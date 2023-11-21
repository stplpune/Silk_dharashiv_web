import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetRuleComponent } from './set-rule.component';

const routes: Routes = [{ path: '', component: SetRuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetRuleRoutingModule { }
