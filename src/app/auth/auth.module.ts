import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

// components
import { SignInComponent } from './components/sign-in/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up/sign-up.component';
import { PassRecoComponent } from './components/pass-recovery/pass-reco/pass-reco.component';
import { SharedModule } from '../shared/shared.module';





@NgModule({
  declarations: [ // here we will declare the components that are part of this module
    SignInComponent,
    SignUpComponent, 
    PassRecoComponent
  ], // these components will be used by the router service so that they can be rendered in AppModule
  imports: [
    CommonModule,// for basic directives
    AuthRoutingModule, // for routing directives that leverage the router service
    ReactiveFormsModule, // to collect data from forms
    SharedModule
  ]
})
export class AuthModule { }
