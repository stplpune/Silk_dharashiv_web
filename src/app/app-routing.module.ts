import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferanceComponent } from './components/referance/referance.component';
import { SecureComponent } from './layouts/secure/secure.component';
import { PublicComponent } from './layouts/public/public.component';
// import { PublicComponent } from './layouts/public/public.component';

const routes: Routes = [
  { path: '', redirectTo: 'ref', pathMatch: 'full' },
  { path: 'ref', component: ReferanceComponent },// For Testing purpose
  {
    path: '',
    component: PublicComponent,
    loadChildren: () => import('./layouts/public/public.module').then(m => m.PublicModule)
  },
  {
    path: '',
    component: SecureComponent,
    loadChildren: () => import('./layouts/secure/secure.module').then(m => m.SecureModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
