import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockCircleComponent } from './block-circle.component';

const routes: Routes = [{ path: '', component: BlockCircleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockCircleRoutingModule { }
