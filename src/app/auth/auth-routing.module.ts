import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up/sign-up.component';
import { PassRecoComponent } from './components/pass-recovery/pass-reco/pass-reco.component';


const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: PassRecoComponent },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' }
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
