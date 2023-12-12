import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficieryListComponent } from './beneficiery-list.component';

const routes: Routes = [{ path: '', component: BeneficieryListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficieryListRoutingModule { }
