import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'login', loadComponent: () => import('../../components/login/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('../../components/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
