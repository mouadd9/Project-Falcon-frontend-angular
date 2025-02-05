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
  declarations: [
    AppComponent
  ],
  imports: [
    // CoreModule is imported only once here, no other feature module will import this module
    // provides application-wide services (interceptors, provided in root services, guards)
    // CoreModule declares components not specific to a feature (used in app module directly like for example a footer or nav bar)
    CoreModule, 
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],

  /* ###################################-----------PROVIDERS */
  providers: [],
  /*  
  - The providers array is part of the @NgModule decorator in Angular. 
  - It tells Angular's dependency injection (DI) system which classes or values should be available for injection.
  - When you provide a service in the providers array of the AppModule, 
    Angular creates a single instance of that service (a singleton) 
    and makes it available to any component, directive, or service that requests it via dependency injection.
  */
 /*
   We will use CoreModule to provide app wide singleton services thus the providers array will 
   be empty in AppModule
  */
  bootstrap: [AppComponent]
})
export class AppModule { }
// AppModule is the root module that bootstraps the application. 
//It only declares the AppComponent and imports other modules. 
//The AppComponent contains the base layout structure where other components will be rendered through router-outlet.