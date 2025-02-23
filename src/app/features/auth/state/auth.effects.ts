// Effects isolate side effects from components, allowing for more pure components that select state and dispatch actions.
// Effects are long-running services that listen to an observable of every action dispatched from the Store.
// Effects filter those actions based on the type of action they are interested in. This is done by using an operator.
// Effects perform tasks, which are synchronous or asynchronous and return a new action.

import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../services/auth.service";
import { AuthActions, AuthApiActions, SignUpFormActions } from "./auth.actions";
import { catchError, delay, from, map, mergeMap, Observable, of, switchMap, tap, timeout } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

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
    private router = inject(Router);
    private store = inject(Store);


    // effect 1 : effects will handle API calls related to requesting email verification codes (Services are injected into effects to interact with external APIs and handle streams.)
    // this Observable will emit actions derived from the inner Observables emissions (success/failure responses)
    // Any action returned from the effect stream is then dispatched back to the Store.
    requestVerificationCodeEffect$: Observable<Action> = createEffect(() => { // createEffect is A function which returns an observable or observable factory. 
        return this.actions$.pipe( // we will use the ofType operator to only let pass certain actions (because this effect will only dispatch actions that are related to sending a verification request )
            ofType(SignUpFormActions.verificationCodeRequestSent), // now for each emission from the outer observable we will use an operator that will return a new observable and subscribe to it
            mergeMap((data) => this.authService.sendVerificationCode(data.payload).pipe(
                delay(5000), // Add 5 second delay before making the request
                map((response) => AuthApiActions.verificationCodeRequestSentSuccess({ payload: response })),
                catchError((error: HttpErrorResponse) => of(AuthApiActions.verificationCodeRequestSentFailure({
                    payload: {
                        error: error.error.error,
                        message: error.error.message,
                        details: error.error.details
                    }
                })))
            ))
        )
    })

    // Store requestId in localStorage when verification code request succeeds
    persistRequestId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthApiActions.verificationCodeRequestSentSuccess),
            map(action => {
                if (action.payload.requestId) {
                    localStorage.setItem('verificationRequestId', action.payload.requestId);
                }
                return { type: '[Auth] Request ID Persisted' };
            })
        );
    });

    signUpEffect$: Observable<Action> = createEffect(() => {
        return this.actions$.pipe(
            ofType(SignUpFormActions.registrationRequestSent),
            mergeMap((data) => this.authService.signUp(data.payload).pipe(
                map((response) => AuthApiActions.registrationRequestSentSuccess({ payload: response })),
                catchError((error: HttpErrorResponse) => of(AuthApiActions.registrationRequestSentFailure({
                    payload: {
                        error: error.error.error,
                        message: error.error.message,
                        details: error.error.details
                    }
                })))
            ))
        )
    })

    signUpSuccessEffect$: Observable<Action> = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthApiActions.registrationRequestSentSuccess),
            switchMap((action) => {
                localStorage.removeItem('verificationRequestId');
                localStorage.setItem('access-token', action.payload.token.accessToken);
              return  from(this.router.navigate(['/my-space'])).pipe(
                tap(() => {this.store.dispatch(AuthActions.updateAuthState())}), 
                map(() => ({ type: '[Auth] Navigation Completed' }))
            )})
           
            /*map((data) => {
                // here we should clear the requestId from the local storage 
                // we should store the jwt
                // then we should route the user to mySpace 
                localStorage.removeItem('verificationRequestId');
                localStorage.setItem('access-token', data.payload.token.accessToken);
                this.router.navigate(['/my-space']);
                return AuthActions.updateAuthState();
            })*/
        )
    })

    // now we need effects that will clear the local storage when the user sign's up

}