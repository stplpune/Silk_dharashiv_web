import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SilkCocoonSellListRoutingModule } from './silk-cocoon-sell-list-routing.module';
import { SilkCocoonSellListComponent } from './silk-cocoon-sell-list.component';


@NgModule({
  declarations: [
    SilkCocoonSellListComponent
  ],
  imports: [
    CommonModule,
    SilkCocoonSellListRoutingModule
  ]
})
export class SilkCocoonSellListModule { }
