import { createReducer, on } from '@ngrx/store';
import {
  AuthActions,
  AuthApiActions,
  LogInFormActions,
  SignUpFormActions,
} from './auth.actions';
import { ErrorResponse } from '../models/error-response';

// Define loading status for type safety
export type LoadingStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

// auth state Shape
export interface AuthState {
  // Authentication
  token: string | null; // this will be changed
  isLoggedIn: boolean; // this will be changed
  refreshToken: string | null;
  // Loading states with type safety
  loadingStates: {
    login: LoadingStatus; // this will be changed
    codeRequest: LoadingStatus;
    signUp: LoadingStatus;
  };

  // Error handling with ErrorResponse type
  errors: {
    login: ErrorResponse | null;
    codeRequest: ErrorResponse | null;
    signUp: ErrorResponse | null;
  };

  // Verification flow
  verificationState: {
    requestId: string | null;
    expiryDate: string | null;
    message: string | null;
    email: string | null;
  };
}

export const initialAuthState: AuthState = {
  // Authentication
  token: null,
  isLoggedIn: false,
  refreshToken: null,
  // Loading states
  loadingStates: {
    login: 'IDLE' as LoadingStatus,
    codeRequest: 'IDLE' as LoadingStatus,
    signUp: 'IDLE' as LoadingStatus,
  },

  // Errors
  errors: {
    login: null,
    codeRequest: null,
    signUp: null,
  },

  // Verification state
  verificationState: {
    requestId: null,
    expiryDate: null,
    message: null,
    email: null,
  },
};

export const authReducer = createReducer(
  initialAuthState,
  // source : [Sign Up Form] , event : Verification Code Request Sent
  on(SignUpFormActions.verificationCodeRequestSent, (state, { payload }) => ({
    // this action will be received by effects too
    ...state,
    loadingStates: {
      ...state.loadingStates,
      codeRequest: 'LOADING' as LoadingStatus,
    },
    verificationState: {
      ...state.verificationState,
      email: payload.email,
    },
    errors: {
      ...state.errors,
      codeRequest: null,
    },
  })),
  // source : [Auth API] , event : verification code request sent to the user's email successfuly
  on(AuthApiActions.verificationCodeRequestSentSuccess,(state, { payload }) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        codeRequest: 'SUCCESS' as LoadingStatus, // code sent !
      },
      errors: {
        ...state.errors, // no error
      },
      verificationState: {
        ...state.verificationState,
        requestId: payload.requestId, // the Auth API responded with a requestId issued after generating a the verification code
        expiryDate: payload.expiryDate, // the Auth API will respond with an expiry date for the code
        message: payload.message,
      },
    })
  ),
  // source : [Auth API], event : verification code request not sent
  on(AuthApiActions.verificationCodeRequestSentFailure, (state, { payload }) => ({
      ...state,
      loadingStates: {
        ...state.loadingStates,
        codeRequest: 'ERROR' as LoadingStatus,
      },
      errors: {
        // in this case it could be different errors : [email is already registered | email service is down | server error while generating code | Rate limit ]
        ...state.errors,
        codeRequest: payload,
      },
      verificationState: {
        ...state.verificationState,
        requestId: null,
        expiryDate: null,
      },
    })
  ),
  // source : [Sign Up Form], event : Registration Request Sent
  // when the user sends a registration request the following happens :
  on(SignUpFormActions.registrationRequestSent, (state, { payload }) => ({
    // this action will be recieved by effects too
    ...state,
    loadingStates: {
      ...state.loadingStates,
      signUp: 'LOADING' as LoadingStatus,
    },
    errors: {
      ...state.errors,
    },
    verificationState: {
      ...state.verificationState,
    },
  })),
  on(AuthApiActions.registrationRequestSentSuccess, (state, { payload }) => ({
    ...state,
    isLoggedIn: true,
    token: payload['access-token'],
    loadingStates: {
      ...state.loadingStates,
      signUp: 'SUCCESS' as LoadingStatus,
    },
    errors: {
      ...state.errors,
    },
    verificationState: {
      ...state.verificationState,
    },
  })),
  on(AuthActions.updateAuthState, (state) => ({
    ...state,
    isLoggedIn: true,
    token: localStorage.getItem('access-token'),
    loadingStates: {
      ...state.loadingStates,
    },
    errors: {
      ...state.errors,
    },
    verificationState: {
      ...state.verificationState,
    },
  })),
  on(AuthActions.tokenExpired, (state) => ({
    ...initialAuthState,
  })),
  on(AuthApiActions.registrationRequestSentFailure, (state, { payload }) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      signUp: 'ERROR' as LoadingStatus,
    },
    errors: {
      ...state.errors,
      signUp: payload,
    },
    verificationState: {
      ...state.verificationState,
      requestId: null,
      expiryDate: null,
    },
  })),
  on(LogInFormActions.logInCredentialsSent, (state, { payload }) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      login: 'LOADING' as LoadingStatus,
    },
    errors: {
      ...state.errors,
    },
    verificationState: {
      ...state.verificationState,
    },
  })),
  on(AuthApiActions.logInCredentialsSentSuccess, (state, { payload }) => ({
    ...state,
    isLoggedIn: true,
    token: payload['access-token'],
    loadingStates: {
      ...state.loadingStates,
      login: 'SUCCESS' as LoadingStatus,
    },
    errors: {
      ...state.errors,
    },
    verificationState: {
      ...state.verificationState,
    },
  })),
  on(AuthApiActions.logInCredentialsSentFailure, (state, { payload }) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      login: 'ERROR' as LoadingStatus,
    },
    errors: {
      ...state.errors,
      login: payload,
    },
    verificationState: {
      ...state.verificationState,
    },
  })),
  on(AuthActions.logout, (state) => ({
    ...initialAuthState,
  }))
);
