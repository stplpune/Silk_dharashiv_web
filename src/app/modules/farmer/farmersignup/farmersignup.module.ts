import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmersignupRoutingModule } from './farmersignup-routing.module';
import { FarmersignupComponent } from './farmersignup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    FarmersignupComponent
  ],
  imports: [
    CommonModule,
    FarmersignupRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class FarmersignupModule { }
