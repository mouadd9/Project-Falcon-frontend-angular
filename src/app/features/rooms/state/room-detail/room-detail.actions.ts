import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { RoomModel } from '../../../../core/models/room.model';

export const RoomDetailActions = createActionGroup({
  source: 'Room Detail',
  events: {
    'Load Room Detail': props<{ roomId: number }>(), // this action will be dispatched when the user clicks in a room card to see its details
    'Load Room Detail Success': props<{ room: RoomModel }>(),
    'Load Room Detail Failure': props<{ error: string }>(),
    'Clear Room Detail': emptyProps()
  },
});

export const JoinRoomActions = createActionGroup({
  source: 'Join Room',
  events: {
    'Join Room': props<{ userId: number, roomId: number }>(),
    'Join Room Success': emptyProps(),
    'Join Room Failure': props<{ error: string }>()
  }
})

export const LeaveRoomActions = createActionGroup({
  source: 'Leave Room', // Added leave room actions
  events: {
    'Leave Room': props<{ userId: number, roomId: number }>(),
    'Leave Room Success': emptyProps(),
    'Leave Room Failure': props<{ error: string }>()
  }
});

export const SaveRoomActions = createActionGroup({
  source: 'Save Room',
  events: {
    'Save Room': props<{ userId: number, roomId: number }>(),
    'Save Room Success': emptyProps(),
    'Save Room Failure': props<{ error: string }>()
  }
})

export const UnsaveRoomActions = createActionGroup({
  source: 'Unsave Room', // Added unsave room actions
  events: {
    'Unsave Room': props<{ userId: number, roomId: number }>(),
    'Unsave Room Success': emptyProps(),
    'Unsave Room Failure': props<{ error: string }>()
  }
});

export const FlagSubmissionActions = createActionGroup({
  source: 'Flag Submission',
  events: {
    'Submit Flag': props<{ userId: number, challengeId: number, flag: string }>(),
    'Submit Flag Success': props<{ challengeId: number, correct: boolean }>(), // this action is dispatched when a flag is sublitted succesfully, we will use the payload to know if the flag is correct or no.
    'Submit Flag Failure': props<{ error: string }>()
  }
});