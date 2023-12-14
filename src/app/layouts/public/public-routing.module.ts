import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('../../components/login/login.component').then(m => m.LoginComponent), data: { breadcrumb: [{ title: 'Login', active: true }] } },
  { path: 'forgot-password', loadComponent: () => import('../../components/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent), data: { breadcrumb: [{ title: 'Forgot Password', active: true }] } },
  { path: 'farmer-signup', loadChildren: () => import('../../modules/farmer/farmersignup/farmersignup.module').then(m => m.FarmersignupModule), data: { breadcrumb: [{ title: 'Farmer Sign Up', active: true }] } },
  { path: 'home', loadChildren: () => import('../../modules/home/home.module').then(m => m.HomeModule), data: { breadcrumb: [{ title: 'Home', active: true }] } },
  { path: 'farmer-login', loadComponent: () => import('../../components/farmer-login/farmer-login.component').then(m => m.FarmerLoginComponent), data: { breadcrumb: [{ title: 'Farmer Login', active: true }] } },
  { path: 'contact-us', loadChildren: () => import('../../modules/contact-us/contact-us.module').then(m => m.ContactUsModule), data: { breadcrumb: [{ title: 'Contact Us', active: true }] } },
  { path: 'track-application', loadChildren: () => import('../../modules/track-app/track-app.module').then(m => m.TrackAppModule) },
  { path: 'blog-details', loadChildren: () => import('../../modules/blog-details/blog-details.module').then(m => m.BlogDetailsModule), data: { breadcrumb: [{ title: 'Blog Details', active: true }] }  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
