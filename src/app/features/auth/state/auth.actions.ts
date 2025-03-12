import { createActionGroup, props, emptyProps, createAction } from "@ngrx/store";
import { VerificationCodeRequest, VerificationCodeResponse } from "../models/verification.model";
import { SignUpRequest, SignUpResponse } from "../models/sign-up.model";
import { ErrorResponse } from "../models/error-response";
import { SignInRequest, SignInResponse } from "../models/sign-in.model";

// actions (events) dispatched from the sign up form
export const SignUpFormActions = createActionGroup({
   source: 'Sign Up Form',
   events: {
     'Verification Code Request Sent': props<{payload: VerificationCodeRequest}>(),
     'Registration Request Sent': props<{payload: SignUpRequest}>()
   }
})

// actions dispatched from the log in form
export const LogInFormActions = createActionGroup({
   source: 'Log In Form',
   events: {
      'log In Credentials Sent': props<{payload:SignInRequest}>()
   }
})


/*
an action should look like this
{
type : [Log In Form] log In Credentials Sent
payload : { username : "username",
            password : "password" }
} 

when we dispatch an action to the store we are actually creation an action
this.store.dispatch(LogInFormActions.logInCredentialsSent({payload : { username : "username", password : "password" }})); // we pass the payload.

*/

// actions dispatched from the Auth API
export const AuthApiActions = createActionGroup({
   source: 'Auth API',
   events: {
      'Verification Code Request Sent Success': props<{payload: VerificationCodeResponse}>(),
      'Verification Code Request Sent Failure': props<{payload: ErrorResponse}>(),
      'Registration Request Sent Success': props<{payload: SignUpResponse}>(),
      'Registration Request Sent Failure': props<{payload: ErrorResponse}>(),
      'log In Credentials Sent Success': props<{payload: SignInResponse}>(),
      'log In Credentials Sent Failure': props<{payload: ErrorResponse}>(),
   }
})

// auth.actions.ts
export const AuthActions = createActionGroup({
   source: 'Auth',
   events: {
     'Update Auth State': emptyProps(),
     'Logout': emptyProps(),
     'Token Expired': emptyProps()
   },
 });
 
 // Add this to existing actions
export const registrationSuccessWithNavigation = createAction(
   '[Auth] Registration Success With Navigation',
   props<{ redirectTo: string[] }>()
 );
