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
import { ChowkiOrderDetailsComponent } from './crc-chawki-order/chowki-order-details/chowki-order-details.component';
import { MatButtonModule } from '@angular/material/button';
import { GrainageOrderDetailsComponent } from './crc-grainage-order/grainage-order-details/grainage-order-details.component';
import { GlobalTableComponent } from "../../../shared/components/global-table/global-table.component";
import {MatIconModule} from '@angular/material/icon';
import { InventoryComponent } from "./inventory/inventory.component";


@NgModule({
    declarations: [
        CrcCenterDetailsComponent,
        ChowkiOrderDetailsComponent,
        GrainageOrderDetailsComponent,
    ],
    imports: [
        CommonModule,
        CrcCenterDetailsRoutingModule,
        MatTabsModule,
        CrcProfileComponent,
        MatIconModule,
        CrcGrainageOrderComponent,
        CrcDeliverySlabsComponent,
        CrcChawkiOrderComponent,
        CrcChawkiOrderDetailsComponent,
        MatButtonModule,
        GlobalTableComponent,
        InventoryComponent
    ]
})
export class CrcCenterDetailsModule { }
