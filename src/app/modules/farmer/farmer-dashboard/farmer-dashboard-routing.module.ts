import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmerDashboardComponent } from './farmer-dashboard.component';

const routes: Routes = [{ path: '', component: FarmerDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmerDashboardRoutingModule { }
