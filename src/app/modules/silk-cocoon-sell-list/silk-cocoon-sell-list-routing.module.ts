import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SilkCocoonSellListComponent } from './silk-cocoon-sell-list.component';

const routes: Routes = [{ path: '', component: SilkCocoonSellListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SilkCocoonSellListRoutingModule { }
