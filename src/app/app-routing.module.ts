import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferanceComponent } from './components/referance/referance.component';

const routes: Routes = [
  {path:'', redirectTo:'ref', pathMatch:'full'},
  {path:'ref', component:ReferanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
