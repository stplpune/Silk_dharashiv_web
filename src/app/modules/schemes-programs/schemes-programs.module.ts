import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchemesProgramsRoutingModule } from './schemes-programs-routing.module';
import { SchemesProgramsComponent } from './schemes-programs.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    SchemesProgramsComponent
  ],
  imports: [
    CommonModule,
    SchemesProgramsRoutingModule,
    TranslateModule
  ]
})
export class SchemesProgramsModule { }
