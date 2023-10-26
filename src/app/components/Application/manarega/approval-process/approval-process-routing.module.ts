import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalProcessComponent } from './approval-process.component';

const routes: Routes = [{ path: '', component: ApprovalProcessComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalProcessRoutingModule { }
