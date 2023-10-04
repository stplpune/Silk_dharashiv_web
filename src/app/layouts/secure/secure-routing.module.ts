import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('../../components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'department', loadChildren: () => import('../../components/masters/office-master/department/department.module').then(m => m.DepartmentModule) },
  { path: 'department-levels', loadChildren: () => import('../../components/masters/office-master/department-levels/department-levels.module').then(m => m.DepartmentLevelsModule) },
  { path: 'designations', loadChildren: () => import('../../components/masters/office-master/designations/designations.module').then(m => m.DesignationsModule) },
  { path: 'block-circle', loadChildren: () => import('../../components/masters/office-master/block-circle/block-circle.module').then(m => m.BlockCircleModule) },
  { path: 'officer-registration', loadChildren: () => import('../../components/masters/office-master/officer-registration/officer-registration.module').then(m => m.OfficerRegistrationModule) },

  // masters -> Rule master routing
  { path: 'schemes', loadChildren: () => import('../../components/masters/rule-master/schemes/schemes.module').then(m => m.SchemesModule) },
  { path: 'actions', loadChildren: () => import('../../components/masters/rule-master/actions/actions.module').then(m => m.ActionsModule) },
  { path: 'set-rule', loadChildren: () => import('../../components/masters/rule-master/set-rule/set-rule.module').then(m => m.SetRuleModule) },

  // CMS section files routing
  { path: 'markets', loadChildren: () => import('../../components/cms/markets/markets.module').then(m => m.MarketsModule) },
  { path: 'market-rate', loadChildren: () => import('../../components/cms/market-rate/market-rate.module').then(m => m.MarketRateModule) },
  { path: 'blogs', loadChildren: () => import('../../components/cms/blogs/blogs.module').then(m => m.BlogsModule) },
  { path: 'faq', loadChildren: () => import('../../components/cms/faq/faq.module').then(m => m.FaqModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
