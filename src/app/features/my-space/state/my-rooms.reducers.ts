// rooms.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { initialRoomsState } from './my-rooms.state';
import {
  JoinedRoomsActions,
  SavedRoomsActions,
  CompletedRoomsActions,
  RoomsFilterActions
} from './my-rooms.actions';

export const myRoomsReducer = createReducer(
  initialRoomsState,
  // on get Joined Rooms
  on(JoinedRoomsActions.load, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  // this action is dispatched from effects and has a payload called rooms
  on(JoinedRoomsActions.loadSuccess, (state, { rooms }) => ({
    ...state,
    joined: rooms,
    isLoading: false,
  })),
  on(JoinedRoomsActions.loadFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  // Saved rooms
  on(SavedRoomsActions.load, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(SavedRoomsActions.loadSuccess, (state, { rooms }) => ({
    ...state,
    saved: rooms,
    isLoading: false,
  })),
  on(SavedRoomsActions.loadFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  // Completed rooms
  on(CompletedRoomsActions.load, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CompletedRoomsActions.loadSuccess, (state, { rooms }) => ({
    ...state,
    completed: rooms,
    isLoading: false,
  })),
  on(CompletedRoomsActions.loadFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  // the reducer detets this dispatched action , extracts the current state, and the payload from the action
  // and returns a new state objects
  on(RoomsFilterActions.set, (state, { filter }) => ({
    ...state, 
    activeFilter: filter
  }))
);