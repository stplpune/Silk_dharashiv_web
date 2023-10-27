import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('../../components/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { breadcrumb: [{ title: 'Dashboard', active: true }] } },
  { path: 'department', loadChildren: () => import('../../components/masters/office-master/department/department.module').then(m => m.DepartmentModule), data: { breadcrumb: [{ title: 'Department', active: true }] } },
  { path: 'designations', loadChildren: () => import('../../components/masters/office-master/designations/designations.module').then(m => m.DesignationsModule), data: { breadcrumb: [{ title: 'Designation', active: true }] } },
  { path: 'block', loadChildren: () => import('../../components/masters/office-master/block-circle/block-circle.module').then(m => m.BlockCircleModule), data: { breadcrumb: [{ title: 'Block', active: true }] } },
  { path: 'officer-registration', loadChildren: () => import('../../components/masters/office-master/officer-registration/officer-registration.module').then(m => m.OfficerRegistrationModule), data: { breadcrumb: [{ title: 'Officer Registration', active: true }] } },
  { path: 'circle', loadChildren: () => import('../../components/masters/office-master/village-circle/village-circle.module').then(m => m.VillageCircleModule), data: { breadcrumb: [{ title: 'Circle', active: true }] } },
  { path: 'grainage', loadChildren: () => import('../../components/masters/office-master/grainage/grainage.module').then(m => m.GrainageModule), data: { breadcrumb: [{ title: 'Grainage', active: true }] }  },

  // masters -> Rule master routing
  { path: 'schemes', loadChildren: () => import('../../components/masters/rule-master/schemes/schemes.module').then(m => m.SchemesModule), data: { breadcrumb: [{ title: 'Schemes', active: true }] } },
  //{ path: 'actions', loadChildren: () => import('../../components/masters/rule-master/actions/actions.module').then(m => m.ActionsModule),  data: { breadcrumb: [{ title: 'Actions', active: true }] } },
  { path: 'set-rule', loadChildren: () => import('../../components/masters/rule-master/set-rule/set-rule.module').then(m => m.SetRuleModule), data: { breadcrumb: [{ title: 'Set Rule', active: true }] }  },
  { path: 'reject-reason', loadChildren: () => import('../../components/masters/rule-master/reject-reason/reject-reason.module').then(m => m.RejectReasonModule), data: { breadcrumb: [{ title: 'Reject Reason', active: true }] } },

  // applications
  { path: 'approval-process', loadChildren: () => import('../../components/Application/manarega/approval-process/approval-process.module').then(m => m.ApprovalProcessModule), data: { breadcrumb: [{ title: 'Approval Process', active: true }] } },
  //{ path: 'approval-process', loadChildren: () => import('./components/Application/manarega/approval-process/approval-process.module').then(m => m.ApprovalProcessModule) },


  // CMS section files routing
  { path: 'markets', loadChildren: () => import('../../components/cms/markets/markets.module').then(m => m.MarketsModule), data: { breadcrumb: [{ title: 'Markets', active: true }] } },
  { path: 'market-rate', loadChildren: () => import('../../components/cms/market-rate/market-rate.module').then(m => m.MarketRateModule), data: { breadcrumb: [{ title: 'Market Rate', active: true }] }},
  { path: 'blogs', loadChildren: () => import('../../components/cms/blogs/blogs.module').then(m => m.BlogsModule), data: { breadcrumb: [{ title: 'Blogs', active: true }] } },
  { path: 'faq', loadChildren: () => import('../../components/cms/faq/faq.module').then(m => m.FaqModule), data: { breadcrumb: [{ title: 'FAQs', active: true }] } },

  // My Profile
  { path: 'my-profile', loadChildren: () => import('../../components/profile/my-profile/my-profile.module').then(m => m.MyProfileModule),data: { breadcrumb: [{ title: 'My Profile', active: true }] }  },

  //Setting
  { path: 'page-right-access', loadChildren: () => import('../../components/setting/page-right-access/page-right-access.module').then(m => m.PageRightAccessModule), data: { breadcrumb: [{ title: 'Page Right Access', active: true }] }  },

  //Application
  { path: 'application', loadChildren: () => import('../../components/Application/manarega/manarega.module').then(m => m.ManaregaModule), data: { breadcrumb: [{ title: 'Manarega', active: true }] }   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
