import { RoomModel } from "../../../my-space/models/room.model";

export interface RoomDetailState {
    currentRoom: RoomModel | null; // this will hold the current selected Room
    isLoading: boolean;
    error: string | null;
  }
  
  export const initialRoomDetailState: RoomDetailState = {
    currentRoom: null,
    isLoading: false,
    error: null
  };