import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ReferanceComponent } from './components/referance/referance.component';
import { SecureComponent } from './layouts/secure/secure.component';
import { PublicComponent } from './layouts/public/public.component';
import { CheckLoggedInGuard } from './core/guards/check-logged-in.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { ErrorComponent } from './modules/error/error.component';
// import { PublicComponent } from './layouts/public/public.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'ref', component: ReferanceComponent },// For Testing purpose
  { path: '', canActivate: [CheckLoggedInGuard], component: PublicComponent, loadChildren: () => import('./layouts/public/public.module').then(m => m.PublicModule) },
  { path: '', canActivate: [AuthGuard], component: SecureComponent, loadChildren: () => import('./layouts/secure/secure.module').then(m => m.SecureModule) },
  { path: 'grainage', loadChildren: () => import('./components/masters/office-master/grainage/grainage.module').then(m => m.GrainageModule) },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
