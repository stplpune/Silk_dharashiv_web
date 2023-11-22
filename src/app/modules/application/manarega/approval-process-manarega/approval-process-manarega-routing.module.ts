import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalProcessManaregaComponent } from './approval-process-manarega.component';

const routes: Routes = [{ path: '', component: ApprovalProcessManaregaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalProcessManaregaRoutingModule { }
