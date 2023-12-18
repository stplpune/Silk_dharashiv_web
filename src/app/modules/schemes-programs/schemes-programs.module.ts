import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchemesProgramsRoutingModule } from './schemes-programs-routing.module';
import { SchemesProgramsComponent } from './schemes-programs.component';


@NgModule({
  declarations: [
    SchemesProgramsComponent
  ],
  imports: [
    CommonModule,
    SchemesProgramsRoutingModule
  ]
})
export class SchemesProgramsModule { }
