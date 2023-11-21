import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateManaregaAppComponent } from './create-manarega-app.component';

const routes: Routes = [{ path: '', component: CreateManaregaAppComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateManaregaAppRoutingModule { }
