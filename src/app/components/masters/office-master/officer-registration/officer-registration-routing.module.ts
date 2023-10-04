import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficerRegistrationComponent } from './officer-registration.component';

const routes: Routes = [{ path: '', component: OfficerRegistrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficerRegistrationRoutingModule { }
