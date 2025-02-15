import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';



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
    provideStoreDevtools({})
    // interceptors ...
  ]
})
export class CoreModule { }
