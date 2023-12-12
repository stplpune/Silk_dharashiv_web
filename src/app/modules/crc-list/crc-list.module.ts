import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRCListRoutingModule } from './crc-list-routing.module';
import { CRCListComponent } from './crc-list.component';


@NgModule({
  declarations: [
    CRCListComponent
  ],
  imports: [
    CommonModule,
    CRCListRoutingModule
  ]
})
export class CRCListModule { }
