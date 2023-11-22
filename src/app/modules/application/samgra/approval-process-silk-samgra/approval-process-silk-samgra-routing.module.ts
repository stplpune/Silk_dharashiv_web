import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalProcessSilkSamgraComponent } from './approval-process-silk-samgra.component';

const routes: Routes = [{ path: '', component: ApprovalProcessSilkSamgraComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalProcessSilkSamgraRoutingModule { }
