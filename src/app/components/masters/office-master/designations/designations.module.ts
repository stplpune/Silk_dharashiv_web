import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationsRoutingModule } from './designations-routing.module';
import { DesignationsComponent } from './designations.component';


@NgModule({
  declarations: [
    DesignationsComponent
  ],
  imports: [
    CommonModule,
    DesignationsRoutingModule
  ]
})
export class DesignationsModule { }
