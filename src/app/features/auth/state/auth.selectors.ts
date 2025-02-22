import { createFeatureSelector, createSelector, select } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

// 1. Feature Selector - Gets the feature slice of state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// 2. Basic Selector - Gets specific properties from feature state
export const selectVerificationState = createSelector(
    selectAuthState,
    (state: AuthState) => state.verificationState
); // we will use this selector to get an observable that emits new verificationStates

export const selectRequestId = createSelector(
    selectVerificationState,
    (state) => state.requestId
);

export const selectCodeRequestStatus = createSelector(
    selectAuthState,
    (state: AuthState) => state.loadingStates.codeRequest
);

export const selectCodeRequestError = createSelector(
    selectAuthState,
    (state: AuthState) => state.errors.codeRequest
);

export const selectVerificationCodeButtonState = createSelector(
    selectCodeRequestStatus,
    (status) => ({
        isLoading: status === 'LOADING',
        buttonText: status === 'LOADING' ? 'Sending...' : 'Send Code'
    })
);
