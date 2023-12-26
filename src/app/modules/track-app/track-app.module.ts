import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackAppRoutingModule } from './track-app-routing.module';
import { TrackAppComponent } from './track-app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TrackApplicationComponent } from 'src/app/components/track-application/track-application.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TrackAppComponent,
  ],
  imports: [
    CommonModule,
    TrackAppRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    TrackApplicationComponent,
    MatInputModule,
    MatIconModule,
    TranslateModule
  ]
})
export class TrackAppModule { }
