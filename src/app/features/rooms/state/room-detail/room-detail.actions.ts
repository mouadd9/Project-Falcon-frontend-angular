// src/app/features/rooms/state/room-detail.actions.ts
import { createActionGroup, props } from '@ngrx/store';
import { RoomModel } from '../../../my-space/models/room.model';

export const RoomDetailActions = createActionGroup({
  source: 'Room Detail',
  events: {
    'Load Room Detail': props<{ // when this action is dispatched it hold with data related to the room
      roomId: number;
      isJoined: boolean;
      isSaved: boolean;
    }>(), // this action will be dispatched when the user clicks in a room card to see its details
    'Load Room Detail Success': props<{ room: RoomModel }>(),
    'Load Room Detail Failure': props<{ error: string }>(),
  },
});
