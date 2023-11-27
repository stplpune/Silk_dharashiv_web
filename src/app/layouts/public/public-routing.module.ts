import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'login', loadComponent: () => import('../../components/login/login.component').then(m => m.LoginComponent), data: { breadcrumb: [{ title: 'Login', active: true }] } },
  { path: 'forgot-password', loadComponent: () => import('../../components/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) ,data: { breadcrumb: [{ title: 'Forgot Password', active: true }] }},
  { path: 'farmer-signup', loadChildren: () => import('../../modules/farmer/farmersignup/farmersignup.module').then(m => m.FarmersignupModule), data: { breadcrumb: [{ title: 'Farmer Sign Up', active: true }] } },
  { path: 'home', loadChildren: () => import('../../modules/home/home.module').then(m => m.HomeModule), data: { breadcrumb: [{ title: 'Home', active: true }] }  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
