import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RejectReasonComponent } from './reject-reason.component';

const routes: Routes = [{ path: '', component: RejectReasonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectReasonRoutingModule { }
