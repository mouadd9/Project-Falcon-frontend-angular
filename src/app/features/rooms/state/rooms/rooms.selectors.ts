import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RoomsState } from "./rooms.state";

export const selectRoomsState = createFeatureSelector<RoomsState>('rooms');

export const selectRooms = createSelector(
    selectRoomsState,
  (state) => state.rooms
);

export const selectRoomsloadingState = createSelector(
    selectRoomsState,
    (state) => state.isLoading
)