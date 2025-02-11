import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

// ###################### ----------- this is the CoreModule : the Module that centralizes everything global in our App
// it is imported once in AppModule 
// it declares components (global components) that will be exclusively referenced at AppComponent (nav bar/footer)
// it can specify providers for injected dependencies. These dependencies are available to:
  // general case : The declarations of any other NgModule that imports the CoreModule. 
  // our case : the declared appComponent by AppModule that will import CoreModule  
// CoreModule will provide app-wide singleton services to AppModule this is why CoreModule should be imported once.
// the service will be instantiated only once (as a singleton) and shared across the entire application. 
// This is because of how Angular's dependency injection (DI) system works.

// so as a recap, coreModule will declare global components, and will provide singleton services
// coreModule will be imported once in AppModule, the services provided in coreModule are registered in the root injector associated with AppModule
@NgModule({
  declarations: [// here we will declare the components that are global to the app (referenced in AppModule's template)
     NavComponent // nav bar will be declared here because its a core global component
  ],
  imports: [// here we will declare all the global modules that should be imported in AppModule and that will be used in all the components of our app.
    CommonModule, // this module provides directives mike ngIf and ngFor, they will be used in 
    SharedModule,
    RouterModule, // we import RouterModule so that we can use routing directives in our nav bar
    HttpClientModule
  ],
  exports: [// here we will export the core components so they can be used in app component without being lazy loaded
    NavComponent // nav bar is exported to be used in app component
  ],
  // here we will provide singleton services that will provided once at root, some @injectables do support providedIn Root but many do not
  // so the ones that do not support that, will be explicitly provided here, so that they can be injected when CoreModule is Imported in AppModule
  // the other API services that injectedIn Root will be put in a folder called services in the /core
  providers: [
    // interceptors ...
  ]
})
export class CoreModule { }
// this core module will contain