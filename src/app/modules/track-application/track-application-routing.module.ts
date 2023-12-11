import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackApplicationComponent } from './track-application.component';

const routes: Routes = [{ path: '', component: TrackApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackApplicationRoutingModule { }
