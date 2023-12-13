import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrcCenterDetailsRoutingModule } from './crc-center-details-routing.module';
import { CrcCenterDetailsComponent } from './crc-center-details.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CrcProfileComponent } from './crc-profile/crc-profile.component';
import { CrcGrainageOrderComponent } from './crc-grainage-order/crc-grainage-order.component';
import { CrcDeliverySlabsComponent } from './crc-delivery-slabs/crc-delivery-slabs.component';
import { CrcChawkiOrderComponent } from './crc-chawki-order/crc-chawki-order.component';
import { CrcChawkiOrderDetailsComponent } from './crc-chawki-order-details/crc-chawki-order-details.component';


@NgModule({
  declarations: [
    CrcCenterDetailsComponent
  ],
  imports: [
    CommonModule,
    CrcCenterDetailsRoutingModule,
    MatTabsModule,
    CrcProfileComponent,
    CrcGrainageOrderComponent,
    CrcDeliverySlabsComponent,
    CrcChawkiOrderComponent,
    CrcChawkiOrderDetailsComponent
  ]
})
export class CrcCenterDetailsModule { }
