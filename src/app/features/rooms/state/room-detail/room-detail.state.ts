import { RoomModel } from '../../../../core/models/room.model';

export interface RoomDetailState {
  // room state
  currentRoom: RoomModel | null; // this will hold the current selected Room
  // loading states
  // Loading states - track different async operations independently
  isLoading: boolean; // Loading room details
  isJoining: boolean; // Joining a room
  isLeaving: boolean; // Leaving a room
  isSaving: boolean; // Saving a room
  isUnsaving: boolean; // Unsaving a room
  // error state
  error: string | null;
}

export const initialRoomDetailState: RoomDetailState = {
  currentRoom: null,
  isLoading: false,
  isJoining: false,
  isLeaving: false,
  isUnsaving: false,
  isSaving: false,
  error: null,
};
