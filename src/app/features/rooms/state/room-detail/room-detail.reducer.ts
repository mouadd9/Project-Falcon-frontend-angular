import { createReducer, on } from '@ngrx/store';
import { initialRoomDetailState } from './room-detail.state';
import {
  FlagSubmissionActions,
  JoinRoomActions,
  LeaveRoomActions,
  RoomDetailActions,
  SaveRoomActions,
  UnsaveRoomActions,
} from './room-detail.actions';
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
  on(LeaveRoomActions.leaveRoomSuccess, (state) => {
    // state.currentRoom shouldnt be modified directly !!!

    let updatedRoom = state.currentRoom; 

    // If there's a current room, update it
    if (updatedRoom) {
      // Reset all challenges to not completed
      const updatedChallenges = updatedRoom.challenges.map((challenge) => ({
        ...challenge,
        completed: false,
      }));

      // we create a new object to avoid mutating the original state
      // Update room with challenges reset and isJoined set to false
      updatedRoom = {
        ...updatedRoom,
        isJoined: false,
        percentageCompleted: 0, // Reset completion percentage
        challenges: updatedChallenges,
      };
    }

    return {
      ...state,
      currentRoom: updatedRoom,
      isLeaving: false,
    };
  }),
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
  })),
  on(FlagSubmissionActions.submitFlag, (state, { challengeId }) => ({
    ...state,
    flagSubmission: {
      ...state.flagSubmission,
      isSubmitting: true,
      submittingChallengeId: challengeId,
      error: null,
    },
  })),
  on(
    FlagSubmissionActions.submitFlagSuccess,
    (state, { challengeId, correct }) => {
      // If the submission was correct, update the current room's challenges
      let updatedRoom = state.currentRoom;

      if (correct && updatedRoom) {
        // Find the challenge and mark it as completed
        const updatedChallenges = updatedRoom.challenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, completed: true }
            : challenge
        );

        // Calculate new completion percentage
        const totalChallenges =
          updatedRoom.totalChallenges || updatedChallenges.length;
        const completedChallenges = updatedChallenges.filter(
          (c) => c.completed
        ).length;
        const percentageCompleted =
          totalChallenges > 0
            ? Math.round((completedChallenges / totalChallenges) * 100)
            : 0;

        updatedRoom = {
          ...updatedRoom,
          challenges: updatedChallenges,
          percentageCompleted,
        };
      }

      return {
        ...state,
        currentRoom: updatedRoom,
        flagSubmission: {
          isSubmitting: false,
          submittingChallengeId: null,
          lastSubmittedChallengeId: challengeId,
          lastSubmissionCorrect: correct,
          error: null,
        },
      };
    }
  ),
  on(FlagSubmissionActions.submitFlagFailure, (state, { error }) => ({
    ...state,
    flagSubmission: {
      ...state.flagSubmission,
      isSubmitting: false,
      submittingChallengeId: null,
      error,
    },
  }))
);
