import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoomService } from '../../services/room.service';
import {
  catchError,
  exhaustMap,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Action } from '@ngrx/store';
import {
  JoinRoomActions,
  LeaveRoomActions,
  RoomDetailActions,
  SaveRoomActions,
  UnsaveRoomActions,
} from '../room-detail/room-detail.actions';
import { JwtService } from '../../../auth/services/jwt.service';

@Injectable()
export class RoomDetailEffects {
  private actions$ = inject(Actions);
  private roomService = inject(RoomService);
  private jwtService = inject(JwtService);

  // we need to create an effect that will do the following
  // intercept actions of type : load room details
  // the issue is we need to know what api we will call after we detect this action
  // we have two cases, the user has already joined the room or not, but how would we know that

  loadRoomDetail$: Observable<Action> = createEffect(() => {
    // createEffect takes a function as parameter this function takes no arg but returns an observable of actions
    return this.actions$.pipe(
      ofType(RoomDetailActions.loadRoomDetail), // now that i have my action that contains the room id to fetch
      // switch map is a high order operator, that takes in an emission
      // and subscribes to an inner observable and returns its emission
      switchMap((action) => {
        const roomId = action.roomId; // we first get the room id
        const userId = this.jwtService.getUserIdFromToken();

        // switchMap will subscribe to this observable and this observable will emit the proper action
        return this.roomService.checkRoomStatus(userId, roomId).pipe(

          // this switch Map will return an emission that has a room with correct status
          switchMap((status) => {
            // Based on actual status from backend, choose which API to call
            if (status.isJoined) {
              // User has joined this room, get detailed view
              // Switch Map will subscribe to this observable and pass the emission
              return this.roomService.getJoinedRoom(userId, roomId);
            } else {
              // User hasn't joined, get basic view
              // Switch Map will subscribe to this observable and pass the emission
              return this.roomService.getRoomById(roomId).pipe(
                map((room) => ({
                  ...room,
                  isSaved: status.isSaved, // Set saved status from backend
                }))
              );
            }
          }),
          // we map the result to an action
          map((room) => RoomDetailActions.loadRoomDetailSuccess({ room })),
          catchError((error) =>
            of(
              RoomDetailActions.loadRoomDetailFailure({
                error: error.message || 'Failed to load room details',
              })
            )
          )
        );

        
      })
    );
  });

  joinRoom$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      // effects subscribes to the actions observable
      ofType(JoinRoomActions.joinRoom),
      exhaustMap((action) => {
        return this.roomService.joinRoom(action.userId, action.roomId).pipe(
          map(() => JoinRoomActions.joinRoomSuccess()),
          catchError((error) =>
            of(
              JoinRoomActions.joinRoomFailure({
                error: error.message || 'Failed to load room details',
              })
            )
          )
        );
      })
    );
  });

  leaveRoom$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LeaveRoomActions.leaveRoom),
      exhaustMap((action) => {
        return this.roomService.leaveRoom(action.userId, action.roomId).pipe(
          map(() => LeaveRoomActions.leaveRoomSuccess()),
          catchError((error) =>
            of(
              LeaveRoomActions.leaveRoomFailure({
                error: error.message || 'Failed to load room details',
              })
            )
          )
        );
      })
    );
  });

  saveRoom$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      // effects subscribes to the actions observable
      ofType(SaveRoomActions.saveRoom),
      exhaustMap((action) => {
        return this.roomService.saveRoom(action.userId, action.roomId).pipe(
          map(() => SaveRoomActions.saveRoomSuccess()),
          catchError((error) =>
            of(
              SaveRoomActions.saveRoomFailure({
                error: error.message || 'Failed to load room details',
              })
            )
          )
        );
      })
    );
  });

  unSaveRoom$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnsaveRoomActions.unsaveRoom),
      exhaustMap((action) => {
        return this.roomService.unsaveRoom(action.userId, action.roomId).pipe(
          map(() => UnsaveRoomActions.unsaveRoomSuccess()),
          catchError((error) =>
            of(
              UnsaveRoomActions.unsaveRoomFailure({
                error: error.message || 'Failed to load room details',
              })
            )
          )
        );
      })
    );
  });
}
