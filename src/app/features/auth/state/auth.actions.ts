import { createActionGroup, props, emptyProps, createAction } from "@ngrx/store";
import { VerificationCodeRequest, VerificationCodeResponse } from "../models/verification.model";
import { SignUpRequest, SignUpResponse } from "../models/sign-up.model";
import { Credentials, logInResponse } from "../models/log-in.model";
import { ErrorResponse } from "../models/error-response";

// actions (events) dispatched from the sign up form
export const SignUpFormActions = createActionGroup({
   source: 'Sign Up Form',
   events: {
     'Verification Code Request Sent': props<{payload: VerificationCodeRequest}>(),
     'Registration Request Sent': props<{payload: SignUpRequest}>()
   }
})


/*
const reque : VerificationCodeRequest;

this.store.dispatch()

"Action"
SignUpFormActions.VerificationCodeRequestSent({ payload: reque  })


{
type : [Sign Up Form] Verification Code Request Sent
payload : reque
} : Action

*/

// actions dispatched from the log in form
export const LogInFormActions = createActionGroup({
   source: 'Log In Form',
   events: {
      'log In Credentials Sent': props<{payload:Credentials}>()
   }
})

// actions dispatched from the Auth API
export const AuthApiActions = createActionGroup({
   source: 'Auth API',
   events: {
      'Verification Code Request Sent Success': props<{payload: VerificationCodeResponse}>(),
      'Verification Code Request Sent Failure': props<{payload: ErrorResponse}>(),
      'Registration Request Sent Success': props<{payload: SignUpResponse}>(),
      'Registration Request Sent Failure': props<{payload: ErrorResponse}>(),
      'log In Credentials Sent Success': props<{payload: logInResponse}>(),
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
