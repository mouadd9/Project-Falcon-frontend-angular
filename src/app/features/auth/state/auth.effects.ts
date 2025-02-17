// Effects isolate side effects from components, allowing for more pure components that select state and dispatch actions.
// Effects are long-running services that listen to an observable of every action dispatched from the Store.
// Effects filter those actions based on the type of action they are interested in. This is done by using an operator.
// Effects perform tasks, which are synchronous or asynchronous and return a new action.

import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../services/auth.service";
import { AuthApiActions, SignUpFormActions } from "./auth.actions";
import { catchError, map, mergeMap, Observable, of } from "rxjs";
import { Action } from "@ngrx/store";

// - isolate side effects from components
// - listen to an observable of every action dispatched from the Store
// - filter actions based on the type of action they are interested in
// - effects perform tasks, and return a new action
// - Effects when used along with Store, decrease the responsibility of the component.

// Effects are injectable service classes with distinct parts : 
  // 1 - An injectable Actions service that provides an observable stream of each action dispatched after the latest state has been reduced.


// we will have an exterior Observable and an interior observable
// the emissions from the exterior Observable trigger emissions from interior observables
// so we observe the emissions of the exterior Observable and according to those emissions we choose what emissions we can introduce in the other end 
// we use high level operators to use an emission from an exterior observable to subscribe to an interior Observable
// rxJS gives us 4 strategies on how to manipulate this.

@Injectable()
export class AuthEffects {
// we inject an Observable that emits all actions dispatched to the store 
private actions$ = inject(Actions);
private authService = inject(AuthService);

// effect 1 : effects will handle API calls related to requesting email verification codes (Services are injected into effects to interact with external APIs and handle streams.)
// this Observable will emit actions derived from the inner Observables emissions (success/failure responses)
// Any action returned from the effect stream is then dispatched back to the Store.
requestVerificationCodeEffect$: Observable<Action>  = createEffect(() => { // createEffect is A function which returns an observable or observable factory. 
    return this.actions$.pipe( // we will use the ofType operator to only let pass certain actions (because this effect will only dispatch actions that are related to sending a verification request )
    ofType(SignUpFormActions.verificationCodeRequestSent), // now for each emission from the outer observable we will use an operator that will return a new observable and subscribe to it
    mergeMap((data) => this.authService.sendVerificationCode(data.payload).pipe(
        map((response) => AuthApiActions.verificationCodeRequestSentSuccess({ payload: response })),
        catchError((error) => of(AuthApiActions.verificationCodeRequestSentFailure({ 
            payload: {
                requestId: null,
                expiryDate: null,
                error: {
                    code: error.code || 'VERIFICATION_CODE_REQUEST_FAILED',
                    message: error.message || 'Failed to send verification code. Please try again.',
                    timestamp: new Date().toISOString()
                }
            }
        })))
    ))

    )
})

}