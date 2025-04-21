import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RoomModel } from '../models/room.model';

// this is a group of actions related to joined rooms
export const JoinedRoomsActions = createActionGroup({
  source: 'MyRooms/Joined',
  events: {
    Load: emptyProps(), // action dispatched by the smart component's ngOnInit
    'Load Success': props<{ rooms: RoomModel[] }>(), // action dispatched by effects after a successful API response containing Joined Rooms
    'Load Failure': props<{ error: string }>(),
  },
});

export const SavedRoomsActions = createActionGroup({
  source: 'MyRooms/Saved',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});

export const CompletedRoomsActions = createActionGroup({
  source: 'MyRooms/Completed',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  }
});

// This action will be dispatched when the user clicks a tab, carrying the new filter value.
// RoomsFilterActions.set({ filter: 'joined' }) -> this created an action object
export const RoomsFilterActions = createActionGroup({
  source: 'MyRooms/TabFilter',
  events: {
    'Set': props<{ filter: 'joined' | 'saved' | 'completed' }>() 
  }
});

// RoomsFilterActions.set({filter: 'joined'}); ->  Dispatches [MyRooms/TabFilter] set, with payload.
/*
actions that can be dispatched : 
{
  type: '[MyRooms/TabFilter] set',
  filter: 'joined', // payload
}
{
  type: '[MyRooms/TabFilter] set',
  filter: 'saved', // payload
}
{
  type: '[MyRooms/TabFilter] set',
  filter: 'completed', // payload
}
  
*/
// these actions are interpreted by the reducer.
// when an action of type, RoomsFilterActions.set is dispatched the reducer will extract the payload 
// and creates a new state. now the idea when we create a new state, new emitions happen.