import { RoomModel } from "../../../core/models/room.model";

// rooms.state.ts
export interface MyRoomsState {
    joined: RoomModel[];
    saved: RoomModel[];
    completed: RoomModel[];
    activeFilter: 'joined' | 'saved' | 'completed'; 
    isLoading: boolean;
    error: string | null;
  }
  
  export const initialMyRoomsState: MyRoomsState = {
    joined: [],
    saved: [],
    completed: [],
    activeFilter: 'joined',
    isLoading: false,
    error: null
  };



  // this activeFilter will help us know which rooms to select.
  // users will emit actions from the dumb component, these actions will contain a filter name 

  // now the idea is the active Filter changes. 
  // and according to each active filter in the state , the selector selects one category of rooms.
  // we select state in the smart component,

