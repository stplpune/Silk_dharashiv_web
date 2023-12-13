import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcCenterDetailsComponent } from './crc-center-details.component';

const routes: Routes = [{ path: '', component: CrcCenterDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrcCenterDetailsRoutingModule { }
