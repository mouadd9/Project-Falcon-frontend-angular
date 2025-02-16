import { createReducer, on } from '@ngrx/store';

export interface AuthState {
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    //verification code flow
    verificationState: {
        email: string | null;
        requestId: string | null;
        expiryDate: string | null;
        isCodeSent: boolean;
        isCodeValid: boolean;
    }
}

export const initialAuthState: AuthState = {
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    verificationState: {
        email: null,
        requestId: null,
        expiryDate: null,
        isCodeSent: false,
        isCodeValid: false
    }
}



export const authReducer = createReducer(
    initialAuthState, // this is the initial state that will be set when the store is created
    // here we will add the actions and their corresponding reducers, for each action a reducer function will be defined
    // each reducer function takes the currrent state as argument and uses the action to make a new state
);


/*
This state structure will allow you to:
Store the email when user enters it
Store the requestId and expiryDate when received from the server
Track the loading state during API calls
Handle any errors that occur during the process
Track whether the code has been sent and validated
*/


/*

SEND_VERIFICATION_CODE -> sendingCodeAuthState
SEND_VERIFICATION_CODE_SUCCESS -> codeSentAuthState
SEND_VERIFICATION_CODE_ERROR -> codeErrorAuthState

export const sendingCodeAuthState: AuthState = {
    token: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
    verificationState: {
        email: 'email',
        requestId: null,
        expiryDate: null,
        isCodeSent: false,
        isCodeValid: false
    }
}

export const codeSentAuthState: AuthState = {
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    verificationState: {
        email: 'email',
        requestId: 'requestId',
        expiryDate: '12-03-2026',
        isCodeSent: true,
        isCodeValid: false
    }
}

export const codeErrorAuthState: AuthState = {
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: 'error',
    verificationState: {
        email: 'email',
        requestId: null,
        expiryDate: null,
        isCodeSent: true,
        isCodeValid: false
    }
}


*/
