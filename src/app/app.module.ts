/*
An NgModule has two main responsibilities:
Declaring components, directives, and pipes that belong to the NgModule
Add providers to the injector for components, directives, and pipes that import the NgModule
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';

// the AppModule should be clean and focused on bootstrapping the application. 
@NgModule({
  declarations: [AppComponent],
  imports: [// all modules here are eagerly loaded at runtime 
    CoreModule, // this module will provide global dependencies
    BrowserModule, // this module provides basic CommonModule directives
    AppRoutingModule, // this module provides a configured router service and provides directives like router-link and router-outlet that will be used with router service to naviguate between routes 
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 
