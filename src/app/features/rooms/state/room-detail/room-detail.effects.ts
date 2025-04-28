import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoomService } from '../../services/room.service';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { RoomDetailActions } from '../room-detail/room-detail.actions';
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

        // Use the status from the action to determine which API to call
        if (action.isJoined) {
          return this.roomService.getJoinedRoom(userId, roomId).pipe(
            tap((room) => {
              console.log(
                'the room with the id : ' + roomId + 'is joined by this user'
              );
              console.log('Room details returned : ');
              console.log(room);
            }),
            // switchMap subscribes
            map((room) => RoomDetailActions.loadRoomDetailSuccess({ room })), // we map the returned into an Action object
            catchError((error) =>
              of(
                RoomDetailActions.loadRoomDetailFailure({
                  error: error.message || 'Failed to load room details',
                })
              )
            )
          );
        } else {
          return this.roomService.getRoomById(roomId).pipe(
            tap((room) => {
              console.log(
                'the room with the id : ' +
                  roomId +
                  'is not joined by this user'
              );
              console.log('Room details returned : ');
              console.log(room);
            }),
            map((room) => {
              console.log('Checking if the user has saved this room : ');
              // If the room is in the saved list, ensure saved status is true
              if (action.isSaved) {
                console.log('its saved ... !!');
                return {
                  ...room,
                  isSaved: true, // this will help us to distinguish saved but not joined rooms
                };
              }
              return room;
            }),
            tap((room) => {
              console.log(
                'the room with the id : ' + roomId + 'is saved by this user'
              );
              console.log('Room details returned : ');
              console.log(room);
            }),
            map((room) => RoomDetailActions.loadRoomDetailSuccess({ room })),
            catchError((error) =>
              of(
                RoomDetailActions.loadRoomDetailFailure({
                  error: error.message || 'Failed to load room details',
                })
              )
            )
          );
        }
      })
    );
  });
}
