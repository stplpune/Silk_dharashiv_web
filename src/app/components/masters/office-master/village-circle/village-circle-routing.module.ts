import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VillageCircleComponent } from './village-circle.component';

const routes: Routes = [{ path: '', component: VillageCircleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VillageCircleRoutingModule { }
