import { createActionGroup, props } from "@ngrx/store";
import { RoomModel } from "../../../../core/models/room.model";


// these are groups of actions related to joined rooms
export const RoomsActions = createActionGroup({
  source: 'Rooms',
  events: {
    Load: props<{userId: number}>(), 
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});