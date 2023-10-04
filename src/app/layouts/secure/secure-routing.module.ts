import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('../../components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'department', loadChildren: () => import('../../components/masters/office-master/department/department.module').then(m => m.DepartmentModule) },
  { path: 'department-levels', loadChildren: () => import('../../components/masters/office-master/department-levels/department-levels.module').then(m => m.DepartmentLevelsModule) },
  { path: 'designations', loadChildren: () => import('../../components/masters/office-master/designations/designations.module').then(m => m.DesignationsModule) },
  { path: 'block-circle', loadChildren: () => import('../../components/masters/office-master/block-circle/block-circle.module').then(m => m.BlockCircleModule) },
  { path: 'officer-registration', loadChildren: () => import('../../components/masters/office-master/officer-registration/officer-registration.module').then(m => m.OfficerRegistrationModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
