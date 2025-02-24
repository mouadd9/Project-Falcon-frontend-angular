import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, timeout } from 'rxjs';
import { VerificationCodeRequest, VerificationCodeResponse } from '../models/verification.model';
import { environment } from '../../../../environments/environment';
import { SignUpRequest, SignUpResponse } from '../models/sign-up.model';

@Injectable({
   providedIn: 'root' // provided at root, the root injector creates a singleton of this service
})
export class AuthService {

   constructor(private http: HttpClient) { }

   public sendVerificationCode(codeRequest: VerificationCodeRequest): Observable<VerificationCodeResponse> {
      // const headers = { 'Content-Type': 'application/json' };
      const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json');
      return this.http.post<VerificationCodeResponse>(`${environment.apiUrl}/auth/verification-codes`, codeRequest, { headers });
      /*
      { headers } <=>  { "headers": { "Content-Type": "application/json" } }
      */
   }
   // we send this : {  "email": "mouad@gmail.com"  }
   /* we get this : 
   {
     "requestId": "550e8400-e29b-41d4-a716-446655440000",
     "message": "Verification code sent to your email",
     "expiryDate": "2023-08-25T15:00:00Z"
    } 
   */
   public signUp(request: SignUpRequest): Observable<SignUpResponse> {
      const headers = new HttpHeaders()
                        .set('Content-Type', 'application/json');
      return this.http.post<SignUpResponse>(`${environment.apiUrl}/auth/signup`, request, { headers });
   }

   // we will handle errors in effects.

}





/*
State Management Evolution: From Subjects to NgRx

1. Traditional Subject-as-Service Pattern:
   - Services maintain state using BehaviorSubjects
   - Expose state as Observables via asObservable()
   - State changes through direct .next() calls
   - State is distributed across multiple services
   - Limited debugging and state tracking capabilities

2. NgRx Architecture:
   - Centralized state management through Store
   - State structure defined through interfaces
   - Initial state provided in reducers
   - Selectors create memoized views of state
   - Actions trigger state changes through pure reducers
   - Effects handle side effects (HTTP calls, etc.)
   - Powerful debugging through Redux DevTools

3. Component Integration:
   - Components inject Store instead of multiple services
   - Select state slices using createSelector
   - Use async pipe in templates for automatic subscription management
   - Promotes unidirectional data flow
   - Better separation of concerns

4. Change Detection Optimization:
   - Use OnPush change detection strategy
   - Change detection triggers only on:
     a) Event emissions from the component
     b) Input reference changes
     c) Explicit change detection triggers
   - Best Practices:
     a) Select state in components using store.select()
     b) Use async pipe in templates
     c) Pass observables to child components
     d) Avoid unnecessary state subscriptions

5. Benefits:
   - Predictable state updates
   - Improved performance through memoization
   - Better testing capabilities
   - Reduced boilerplate compared to manual subject management
   - Scalable state management for large applications
*/










/*
if we are using Subject as service approach we would've implemented Ngrx ourselves: 
 - by exposing observables that emit new state, components should inject services and use the exposed observables
 - and by creating methods that perform actions and change state by pushing new state to the BehavioralSubject using .next()

 So using Ngrx we usually follow this logic : 
  - first we need to know how will the state look like.
  - then provide an initial state to the store
  - then inject the store into components that need to subscribe to the state.
  - then create selectors, these selectors gave access to the specific slices of the store
  - when used in components they provide specific Observables that emit only the parts of the state that we need
  - then our component will subscribe to the state, using async


  now we need to be aware of how to consume selected observables from the store in our components 
  we need to consider change detection.
  we usually use the OnPush strategy in our component this means that teh change detection cycle will only trigger in three cases : 
    - if we emit an event from a component 
    - or when we receive a new reference from parent component to an input property of a child component 
    - or when we manually trigger it
    
 so what will usually happen is , we will select state from the store.
 and pass that observable to the template then subscribe to it in the template and wait for new emissions.
 or if we have nested components we will pass the selected observable to a child component's input, using this technique 
 the change detection will be done once (when teh input ref will change to get the new observable) then after this all emissions will not trigger change detection.

 so the idea here is we will use observables instead of declaring arrays or variables in our components.
 and this will reduce the change detection cycles and will decouple our component .



*/