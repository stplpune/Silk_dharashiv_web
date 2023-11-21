import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManaregaComponent } from './manarega.component';

const routes: Routes = [{ path: '', component: ManaregaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManaregaRoutingModule { }
