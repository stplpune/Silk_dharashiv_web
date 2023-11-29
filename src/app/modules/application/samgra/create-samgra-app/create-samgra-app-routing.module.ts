import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSamgraAppComponent } from './create-samgra-app.component';

const routes: Routes = [{ path: '', component: CreateSamgraAppComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSamgraAppRoutingModule { }
