import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackAppComponent } from './track-app.component';

const routes: Routes = [{ path: '', component: TrackAppComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackAppRoutingModule { }
