import { createReducer, on } from "@ngrx/store";
import { initialRoomsState } from "./rooms.state";
import { RoomsActions } from "./rooms.actions";


export const roomsReducer = createReducer(
  initialRoomsState,
  on(RoomsActions.load, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(RoomsActions.loadSuccess, (state, { rooms }) => ({
    ...state,
    rooms: rooms,
    isLoading: false,
  })),
  on(RoomsActions.loadFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);