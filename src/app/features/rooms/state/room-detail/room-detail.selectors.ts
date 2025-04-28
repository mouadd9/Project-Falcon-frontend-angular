import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RoomDetailState } from "../room-detail/room-detail.state";

// this selector selects the entire feature state, we usually do not use this directly in components !!!
export const selectRoomDetailState = createFeatureSelector<RoomDetailState>('roomDetail'); 

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

