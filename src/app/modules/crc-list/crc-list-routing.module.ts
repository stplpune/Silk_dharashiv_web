import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRCListComponent } from './crc-list.component';

const routes: Routes = [{ path: '', component: CRCListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRCListRoutingModule { }
