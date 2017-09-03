import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard';
import { ProfileComponent } from './components/profile/profile';
import { VerificationComponent } from './components/verification/verification';
import { BillingComponent } from './components/billing/billing';
import { VerifyMobileComponent } from './components/verification/verify-mobile';
import { VerifyDriverLicenceComponent } from './components/verification/verify-driver-licence';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'verify',
    component: VerificationComponent,
    children: [
      { path: 'mobile', component: VerifyMobileComponent },
      { path: 'driver-licence', component: VerifyDriverLicenceComponent }
    ]
  },
  {
    path: 'billing',
    component: BillingComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'verify',
    redirectTo: '/verify/mobile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
