import { createFeatureSelector, createSelector, select } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

// 1. Feature Selector - Gets the feature slice of state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectVerificationState = createSelector(
    selectAuthState,
    (state: AuthState) => state.verificationState
); // we will use this selector to get an observable that emits new verificationStates

export const selectCodeRequestStatus = createSelector(
    selectAuthState,
    (state: AuthState) => state.loadingStates.codeRequest
);

export const selectSignUpRequestStatus = createSelector(
    selectAuthState,
    (state: AuthState) => state.loadingStates.signUp
)

export const selectCodeRequestError = createSelector(
    selectAuthState,
    (state: AuthState) => state.errors.codeRequest
);

export const selectSignInRequestStatus = createSelector(
    selectAuthState,
    (state: AuthState) => state.loadingStates.login
)

export const selectVerificationCodeButtonState = createSelector(
    selectCodeRequestStatus,
    (status) => ({
        isLoading: status === 'LOADING',
        buttonText: status === 'LOADING' ? 'Sending...' : 'Send Code'
    })
);

export const selectSignUpButtonState = createSelector(
    selectSignUpRequestStatus,
    (status) => ({
        isLoading: status === 'LOADING',
        buttonText: status === 'LOADING' ? 'Signing Up...' : 'Sign Up'
    })
)

export const selectSignInButtonState = createSelector(
    selectSignInRequestStatus,
    (status) => ({
        isLoading: status === 'LOADING',
        buttonText: status === 'LOADING' ? 'Loging In...' : 'Sign Up'
    })
)
