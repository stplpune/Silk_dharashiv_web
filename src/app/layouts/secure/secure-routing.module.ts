import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseGuard } from 'src/app/core/guards/expense.guard';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard] },
  // { path: 'dashboard', loadComponent: () => import('../../modules/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { breadcrumb: [{ title: 'Dashboard', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'department', loadChildren: () => import('../../modules/masters/office-master/department/department.module').then(m => m.DepartmentModule), data: { breadcrumb: [{ title: 'Department', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'designations', loadChildren: () => import('../../modules/masters/office-master/designations/designations.module').then(m => m.DesignationsModule), data: { breadcrumb: [{ title: 'Designation', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'block', loadChildren: () => import('../../modules/masters/office-master/block-circle/block-circle.module').then(m => m.BlockCircleModule), data: { breadcrumb: [{ title: 'Block', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'officer-registration', loadChildren: () => import('../../modules/masters/office-master/officer-registration/officer-registration.module').then(m => m.OfficerRegistrationModule), data: { breadcrumb: [{ title: 'Officer Registration', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'circle', loadChildren: () => import('../../modules/masters/office-master/village-circle/village-circle.module').then(m => m.VillageCircleModule), data: { breadcrumb: [{ title: 'Circle', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'grainage', loadChildren: () => import('../../modules/masters/office-master/grainage/grainage.module').then(m => m.GrainageModule), data: { breadcrumb: [{ title: 'Grainage', active: true }] }, canActivate: [ExpenseGuard] },

  // masters -> Rule master routing
  { path: 'schemes', loadChildren: () => import('../../modules/masters/rule-master/schemes/schemes.module').then(m => m.SchemesModule), data: { breadcrumb: [{ title: 'Schemes', active: true }] }, canActivate: [ExpenseGuard] },
  //{ path: 'actions', loadChildren: () => import('../../components/masters/rule-master/actions/actions.module').then(m => m.ActionsModule),  data: { breadcrumb: [{ title: 'Actions', active: true }] } },
  { path: 'set-rule', loadChildren: () => import('../../modules/masters/rule-master/set-rule/set-rule.module').then(m => m.SetRuleModule), data: { breadcrumb: [{ title: 'Set Rule', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'reject-reason', loadChildren: () => import('../../modules/masters/rule-master/reject-reason/reject-reason.module').then(m => m.RejectReasonModule), data: { breadcrumb: [{ title: 'Reject Reason', active: true }] }, canActivate: [ExpenseGuard] },

  // applications
  { path: 'application', loadChildren: () => import('../../modules/application/application.module').then(m => m.ApplicationModule), data: { breadcrumb: [{ title: 'Application', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'approval-process-manarega', loadChildren: () => import('../../modules/application/manarega/approval-process-manarega/approval-process-manarega.module').then(m => m.ApprovalProcessManaregaModule), data: { breadcrumb: [{ title: 'Approval Process Manarga', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'approval-process-silk-samgra', loadChildren: () => import('../../modules/application/samgra/approval-process-silk-samgra/approval-process-silk-samgra.module').then(m => m.ApprovalProcessSilkSamgraModule), data: { breadcrumb: [{ title: 'Approval Process Silk Samgra', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'create-manarega-app', loadChildren: () => import('../../modules/application/manarega/create-manarega-app/create-manarega-app.module').then(m => m.CreateManaregaAppModule), data: { breadcrumb: [{ title: 'Create Manarega App', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'create-samgra-app', loadChildren: () => import('../../modules/application/samgra/create-samgra-app/create-samgra-app.module').then(m => m.CreateSamgraAppModule), data: { breadcrumb: [{ title: 'Create Samgra App', active: true }] } },
  { path: 'generate-pdf-manrega', loadComponent: () => import('../../modules/application/manarega/approval-process-manarega/generate-pdf-mgnrega/generate-pdf-mgnrega.component').then(m => m.GeneratePdfMgnregaComponent), data: { breadcrumb: [{ title: 'Generate Pdf Mgnrega', active: true }] }, canActivate: [] },
  { path: 'generate-pdf-silksamgra', loadComponent: () => import('../../modules/application/samgra/approval-process-silk-samgra/generate-pdf-silksamgra/generate-pdf-silksamgra.component').then(m => m.GeneratePdfSilksamgraComponent), data: { breadcrumb: [{ title: 'Generate Pdf SilkSamgra', active: true }] }, canActivate: [] },

  //farmer
  //{ path: 'farmersignup', loadChildren: () => import('../../modules/farmer/farmersignup/farmersignup.module').then(m => m.FarmersignupModule), data: { breadcrumb: [{ title: 'Farmer Sign Up', active: true }] }, canActivate: [ExpenseGuard]  },


  // CMS section files routing
  { path: 'markets', loadChildren: () => import('../../modules/cms/markets/markets.module').then(m => m.MarketsModule), data: { breadcrumb: [{ title: 'Markets', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'market-rate', loadChildren: () => import('../../modules/cms/market-rate/market-rate.module').then(m => m.MarketRateModule), data: { breadcrumb: [{ title: 'Market Rate', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'blogs', loadChildren: () => import('../../modules/cms/blogs/blogs.module').then(m => m.BlogsModule), data: { breadcrumb: [{ title: 'Blogs', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'faq', loadChildren: () => import('../../modules/cms/faq/faq.module').then(m => m.FaqModule), data: { breadcrumb: [{ title: 'FAQs', active: true }] }, canActivate: [ExpenseGuard] },

  // My Profile
  { path: 'my-profile', loadChildren: () => import('../../components/profile/my-profile/my-profile.module').then(m => m.MyProfileModule), data: { breadcrumb: [{ title: 'My Profile', active: true }] }, canActivate: [ExpenseGuard] },

  //Setting
  { path: 'page-right-access', loadChildren: () => import('../../modules/setting/page-right-access/page-right-access.module').then(m => m.PageRightAccessModule), data: { breadcrumb: [{ title: 'Page Right Access', active: true }] }, canActivate: [ExpenseGuard] },

  //CRC

  { path: 'crc-list', loadChildren: () => import('../../modules/crc-list/crc-list.module').then(m => m.CRCListModule), data: { breadcrumb: [{ title: 'CRC List ', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'beneficiery-list', loadChildren: () => import('../../modules/beneficiery/beneficiery.module').then(m => m.BeneficieryModule), data: { breadcrumb: [{ title: 'Beneficiery List', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'beneficiery-details', loadChildren: () => import('../../modules/beneficiery/beneficiery-details/beneficiery-details.module').then(m => m.BeneficieryDetailsModule), data: { breadcrumb: [{ title: 'Beneficiery List', active: true }] }, canActivate: [ExpenseGuard] },
  { path: 'crc-center-details', loadChildren: () => import('../../modules/crc-list/crc-center-details/crc-center-details.module').then(m => m.CrcCenterDetailsModule), data: { breadcrumb: [{ title: 'CRC Center Details', active: true }] }, canActivate: [ExpenseGuard] },
  //Application

  { path: 'beneficiery', loadChildren: () => import('../../modules/beneficiery/beneficiery.module').then(m => m.BeneficieryModule), data: { breadcrumb: [{ title: 'Beneficiery List', active: true }] } },
  { path: 'farmer-dashboard', loadChildren: () => import('../../modules/farmer/farmer-dashboard/farmer-dashboard.module').then(m => m.FarmerDashboardModule), data: { breadcrumb: [{ title: 'Farmer Dashboard', active: true }] } },

  { path: 'silk-cocoon-sell-list', loadChildren: () => import('../../modules/silk-cocoon-sell-list/silk-cocoon-sell-list.module').then(m => m.SilkCocoonSellListModule) },
 

  { path: 'access-denied', loadChildren: () => import('../../modules/error/error.module').then(m => m.ErrorModule), data: { breadcrumb: [{ title: 'Access Denied', active: true }] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
