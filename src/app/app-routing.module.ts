import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferanceComponent } from './components/referance/referance.component';
import { SecureComponent } from './layouts/secure/secure.component';
import { PublicComponent } from './layouts/public/public.component';
import { CheckLoggedInGuard } from './core/guards/check-logged-in.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { GlobalTableComponent } from './shared/global-table/global-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { PublicComponent } from './layouts/public/public.component';

const routes: Routes = [
  { path: '', redirectTo: 'ref', pathMatch: 'full' },
  { path: 'ref', component: ReferanceComponent },// For Testing purpose
  {path: '', canActivate: [CheckLoggedInGuard],component: PublicComponent,loadChildren: () => import('./layouts/public/public.module').then(m => m.PublicModule)},
  {path: '',canActivate: [AuthGuard],component: SecureComponent,loadChildren: () => import('./layouts/secure/secure.module').then(m => m.SecureModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    MatFormFieldModule,
    MatButtonModule,
     MatSelectModule, 
     FormsModule, 
     ReactiveFormsModule,
     MatInputModule ,
     MatRadioModule,
     MatInputModule,
     MatRadioModule,
     GlobalTableComponent,
     MatRadioModule,
     MatTableModule],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
