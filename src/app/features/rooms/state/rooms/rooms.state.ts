import { RoomModel } from '../../../../core/models/room.model';

export interface RoomsState {
  rooms: RoomModel[];
  isLoading: boolean;
  error: string | null;
}

export const initialRoomsState: RoomsState = {
  rooms: [],
  isLoading: false,
  error: null,
};
