import { createActionGroup, props } from "@ngrx/store";
import { RoomModel } from "../../../../core/models/room.model";

export interface RoomFilterCriteria {
  complexity?: 'EASY' | 'MEDIUM' | 'HARD';
  enrollmentStatus?: 'ALL' | 'ENROLLED' | 'NOT_ENROLLED';
  completionStatus?: 'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  searchTerm?: string;
  sortBy?: 'NEWEST' | 'MOST_USERS';
}

// these are groups of actions related to joined rooms
export const RoomsActions = createActionGroup({
  source: 'Rooms',
  events: {
    Load: props<{userId: number; criteria?: RoomFilterCriteria}>(), 
    'Load Success': props<{ rooms: RoomModel[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Update Filter Criteria': props<{ criteria: RoomFilterCriteria }>(),
    'Clear Filters': props<{userId: number}>(),
  },
});