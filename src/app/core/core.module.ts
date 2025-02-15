import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
     NavComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule, 
    HttpClientModule
  ],
  exports: [
    NavComponent 
  ],
  providers: [
    // interceptors ...
  ]
})
export class CoreModule { }
