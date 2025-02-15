import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './features/auth/state/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// the AppModule should be clean and focused on bootstrapping the application. 
@NgModule({
  declarations: [AppComponent],
  imports: [// all modules here are eagerly loaded at runtime 
    CoreModule, // this module will provide global dependencies
    BrowserModule, // this module provides basic CommonModule directives
    AppRoutingModule, // this module provides a configured router service and provides directives like router-link and router-outlet that will be used with router service to naviguate between routes 
    BrowserAnimationsModule,
    StoreModule.forRoot({auth: authReducer}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
    // generally the AppModule doesnt register slices of state that are related to a feature
    // here we registered the auth state !!
    // but in general we put StoreModule.forRoot({}), until other features load !
    // in this case we need auth state to hide the nav bar when the user is not authenticated.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 

/* 
here we will import the StoreModule and we will use .forRoot() method to configure the store.
The .forRoot() method takes in a reducer and configures the store service and then provide it at root level.
The reducers object is where you define your application's state.

*/