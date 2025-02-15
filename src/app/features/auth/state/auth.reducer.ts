// here we Define the reducer function to handle state changes.
/*
Reducers are pure functions in that they produce the same output for a given input.
They are without side effects and handle each state transition synchronously.
Each reducer function takes the latest Action dispatched, the current state,
and determines whether to return a newly modified state or the original state.
*/
import { createReducer, on } from '@ngrx/store';
import { User } from "../../../core/models/user.model";


// Step 1 : Define the state shape 
/*
You define the shape of the state according to what you are capturing,
whether it be a single type such as a number, 
or a more complex object with multiple properties.
*/
export interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
  }


// Setting the initial state
export const initialAuthState: AuthState = {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  };

export const authReducer = createReducer(
    initialAuthState, // this is the initial state that will be set when the store is created
    // here we will add the actions and their corresponding reducers, for each action a reducer function will be defined
    // each reducer function takes the currrent state as argument and uses the action to make a new state
);
