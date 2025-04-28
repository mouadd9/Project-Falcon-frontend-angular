import { NgModule } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './interceptors';


@NgModule({
  declarations: [
     NavComponent
  ],
  imports: [
    SharedModule,
    RouterModule, 
    HttpClientModule, // this should be available globally
    BrowserAnimationsModule
  ],
  exports: [
    NavComponent 
  ],
  providers: [
    httpInterceptorProviders
  ]
})
export class CoreModule { }
