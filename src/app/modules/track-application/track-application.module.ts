import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackApplicationRoutingModule } from './track-application-routing.module';
import { TrackApplicationComponent } from './track-application.component';


@NgModule({
  declarations: [
    TrackApplicationComponent
  ],
  imports: [
    CommonModule,
    TrackApplicationRoutingModule
  ]
})
export class TrackApplicationModule { }
