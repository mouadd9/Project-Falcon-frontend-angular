import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './features/auth/state/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthEffects } from './features/auth/state/auth.effects';
import { MarkdownModule } from 'ngx-markdown';
import {Store} from '@ngrx/store';
import { tap } from 'rxjs';
// the AppModule should be clean and focused on bootstrapping the application.
@NgModule({
  declarations: [AppComponent],
  imports: [
    // all modules here are eagerly loaded at runtime
    CoreModule, // this module will provide global dependencies
    BrowserModule, // this module provides basic CommonModule directives
    AppRoutingModule, // this module provides a configured router service and provides directives like router-link and router-outlet that will be used with router service to naviguate between routes
    // Keep auth reducer in root store since navbar needs it
    MarkdownModule.forRoot(),
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    // ✅ MODIFICATION : Ajouter trace pour debug
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      trace: true, // ✅ Active le tracing des stack traces
      traceLimit: 75, // ✅ Limite de la stack trace (optionnel)
      actionSanitizer: (action, id) => {
        console.log('Action dispatched:', action.type, action);
        return action;
      },
      stateSanitizer: (state, index) => {
        console.log('State updated:', state);
        return state;
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
// Add this to your AppModule constructor for debugging
export class AppModule {
  constructor(private store: Store) {
    if (isDevMode()) {
      // Monitor all action dispatches
      this.store
        .pipe(
          tap((state) => {
            // This will log every state change
          })
        )
        .subscribe();

      // Add action counter to detect loops
      let actionCount = 0;
      const originalDispatch = Store.prototype.dispatch;
      
      // ✅ Fix the type signature to match Store's dispatch overloads
      Store.prototype.dispatch = function (...args: any[]): any {
        actionCount++;

        const action = args[0];
        if (action && action.type && action.type.includes('terminateInstance')) {
          console.log(`🔄 terminateInstance dispatch #${actionCount}:`, action);
          if (actionCount > 10) {
            console.error('🚨 INFINITE LOOP DETECTED - STOPPING');
            // For action dispatch, return void; for effect dispatch, return undefined
            return;
          }
        }

        // Call original dispatch with all arguments and return its result
        return originalDispatch.apply(this, args as [any]);
      };
    }
  }
}
