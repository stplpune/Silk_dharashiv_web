import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchemesRoutingModule } from './schemes-routing.module';
import { SchemesComponent } from './schemes.component';


@NgModule({
  declarations: [
    SchemesComponent
  ],
  imports: [
    CommonModule,
    SchemesRoutingModule
  ]
})
export class SchemesModule { }
