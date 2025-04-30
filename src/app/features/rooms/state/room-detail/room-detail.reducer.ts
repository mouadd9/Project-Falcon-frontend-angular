import { createReducer, on } from '@ngrx/store';
import { initialRoomDetailState } from './room-detail.state';
import { JoinRoomActions, LeaveRoomActions, RoomDetailActions, SaveRoomActions, UnsaveRoomActions } from './room-detail.actions';
import { JoinedRoomsActions } from '../../../my-space/state/my-rooms.actions';

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
  })),
  on(RoomDetailActions.clearRoomDetail, () => ({
    ...initialRoomDetailState,
  })),
  // when a user clicks to join a room, we should show a spinner in the join Room button

   // Join room
   on(JoinRoomActions.joinRoom, (state) => ({
    ...state,
    isJoining: true,
    error: null,
  })),
  on(JoinRoomActions.joinRoomSuccess, (state) => ({
    ...state,
    currentRoom: state.currentRoom
      ? {
          ...state.currentRoom,
          isJoined: true,
        }
      : null,
    isJoining: false,
  })),
  on(JoinRoomActions.joinRoomFailure, (state, { error }) => ({
    ...state,
    error,
    isJoining: false,
  })),
  
  // Leave room
  on(LeaveRoomActions.leaveRoom, (state) => ({
    ...state,
    isLeaving: true,
    error: null,
  })),
  on(LeaveRoomActions.leaveRoomSuccess, (state) => ({
    ...state,
    currentRoom: state.currentRoom
      ? {
          ...state.currentRoom,
          isJoined: false,
        }
      : null,
    isLeaving: false,
  })),
  on(LeaveRoomActions.leaveRoomFailure, (state, { error }) => ({
    ...state,
    error,
    isLeaving: false,
  })),
  
  // Save room
  on(SaveRoomActions.saveRoom, (state) => ({
    ...state,
    isSaving: true,
    error: null,
  })),
  on(SaveRoomActions.saveRoomSuccess, (state) => ({
    ...state,
    currentRoom: state.currentRoom
      ? {
          ...state.currentRoom,
          isSaved: true,
        }
      : null,
    isSaving: false,
  })),
  on(SaveRoomActions.saveRoomFailure, (state, { error }) => ({
    ...state,
    error,
    isSaving: false,
  })),
  
  // Unsave room
  on(UnsaveRoomActions.unsaveRoom, (state) => ({
    ...state,
    isUnsaving: true,
    error: null,
  })),
  on(UnsaveRoomActions.unsaveRoomSuccess, (state) => ({
    ...state,
    currentRoom: state.currentRoom
      ? {
          ...state.currentRoom,
          isSaved: false,
        }
      : null,
    isUnsaving: false,
  })),
  on(UnsaveRoomActions.unsaveRoomFailure, (state, { error }) => ({
    ...state,
    error,
    isUnsaving: false,
  }))
);
