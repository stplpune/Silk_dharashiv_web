import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficieryDetailsComponent } from './beneficiery-details.component';

const routes: Routes = [{ path: '', component: BeneficieryDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficieryDetailsRoutingModule { }
