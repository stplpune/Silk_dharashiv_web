import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackApplicationRoutingModule } from './track-application-routing.module';
import { TrackApplicationComponent } from './track-application.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    TrackApplicationComponent
  ],
  imports: [
    CommonModule,
    TrackApplicationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class TrackApplicationModule { }
