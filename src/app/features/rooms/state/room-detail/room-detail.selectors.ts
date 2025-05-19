import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RoomDetailState } from "../room-detail/room-detail.state";

// this selector selects the entire feature state, we usually do not use this directly in components !!!
export const selectRoomDetailState = createFeatureSelector<RoomDetailState>('room-detail'); 

export const selectCurrentRoom = createSelector(
    selectRoomDetailState, // source
    (state) => state.currentRoom // projector function (receives the emitted values originating from the source)
)

export const selectRoomDetailLoading = createSelector(
    selectRoomDetailState, // source
    (state) => state.isLoading // projector function (receives the emitted values originating from the source)
)

export const selectRoomDetailError = createSelector(
    selectRoomDetailState, // source
    (state) => state.error // projector function (receives the emitted values originating from the source)
)

// UI-friendly derived selectors
export const savingButtonState = createSelector(
    selectRoomDetailState,
    (state): string => {
        if (state.isSaving) {
            return "saving...";
        } else if (state.isUnsaving) {
            return "unsaving...";
        } else if (!state.isSaving && state.currentRoom?.isSaved) {
            return "unsave";
        } else {
            return "save";
        }
    }
);

export const joiningButtonState = createSelector(
    selectRoomDetailState,
    (state): string => {
        if (state.isJoining) {
            return "joining...";
        } else if (state.isLeaving) {
            return "leaving...";
        } else if (!state.isJoining && state.currentRoom?.isJoined) {
            return "leave";
        } else {
            return "join";
        }
    }
);

// Disabled state selectors for buttons
export const isSaveButtonDisabled = createSelector(
    selectRoomDetailState,
    (state) => state.isSaving || state.isUnsaving
);

export const isJoinButtonDisabled = createSelector(
    selectRoomDetailState,
    (state) => state.isJoining || state.isLeaving
);

// Add these selectors to the existing file room-detail.selectors.ts

// this selects flagSubmission state from the room detail state
/**
   flagSubmission: {
    isSubmitting: false,
    submittingChallengeId: null,
    lastSubmittedChallengeId: null,
    lastSubmissionCorrect: null,
    error: null,
  }
 */
export const selectFlagSubmissionState = createSelector(
  selectRoomDetailState,
  (state) => state.flagSubmission
);

// this selects loading state for flag submission
/**
    isSubmitting: false
 */
export const selectIsSubmittingFlag = createSelector(
  selectFlagSubmissionState,
  (state) => state.isSubmitting
);

// this selects the challengeId that is being submitted
export const selectSubmittingChallengeId = createSelector(
  selectFlagSubmissionState,
  (state) => state.submittingChallengeId
);

export const selectLastSubmissionResult = createSelector(
  selectFlagSubmissionState,
  (state) => ({
    challengeId: state.lastSubmittedChallengeId,
    correct: state.lastSubmissionCorrect
  })
);

export const selectFlagSubmissionError = createSelector(
  selectFlagSubmissionState,
  (state) => state.error
);