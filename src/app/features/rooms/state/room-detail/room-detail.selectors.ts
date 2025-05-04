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

