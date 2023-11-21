import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SilkSamgraComponent } from './silk-samgra.component';

const routes: Routes = [{ path: '', component: SilkSamgraComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SilkSamgraRoutingModule { }
