import { RoomModel } from '../../../../core/models/room.model';
import { RoomFilterCriteria } from './rooms.actions';

export interface RoomsState {
  rooms: RoomModel[];
  filteredRooms: RoomModel[];
  filterCriteria: RoomFilterCriteria;
  isLoading: boolean;
  error: string | null;
}

export const initialRoomsState: RoomsState = {
  rooms: [],
  filteredRooms: [],
  filterCriteria: {},
  isLoading: false,
  error: null,
};
