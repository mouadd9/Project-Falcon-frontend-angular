import { createReducer, on } from '@ngrx/store';
import { initialRoomDetailState } from './room-detail.state';
import { RoomDetailActions } from './room-detail.actions';

export const roomDetailReducer = createReducer(
  initialRoomDetailState,
  // when the user dispatches this action the new state should be in loading state
  on(RoomDetailActions.loadRoomDetail, (state) => ({
    ...state, // we preserve references
    isLoading: true,
    error: null,
  })),
  on(RoomDetailActions.loadRoomDetailSuccess, (state, { room }) => ({
    ...state,
    currentRoom: room,
    isLoading: false,
  })),
  on(RoomDetailActions.loadRoomDetailFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
