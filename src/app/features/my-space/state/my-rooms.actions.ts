import { createActionGroup, props } from '@ngrx/store';
import { RoomModel } from '../models/room.model';

// these are groups of actions related to joined rooms
export const JoinedRoomsActions = createActionGroup({
  source: 'MyRooms/Joined',
  events: {
    Load: props<{userId: number}>(), 
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});

export const SavedRoomsActions = createActionGroup({
  source: 'MyRooms/Saved',
  events: {
    Load: props<{userId: number}>(), 
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});

export const CompletedRoomsActions = createActionGroup({
  source: 'MyRooms/Completed',
  events: {
    Load: props<{userId: number}>(),
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  }
});

export const RoomsFilterActions = createActionGroup({
  source: 'MyRooms/TabFilter',
  events: {
    'Set': props<{ filter: 'joined' | 'saved' | 'completed' }>() 
  }
});