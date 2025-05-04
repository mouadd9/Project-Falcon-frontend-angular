import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { MyRoomsService } from '../services/my-rooms.service';
import {
  JoinedRoomsActions,
  SavedRoomsActions,
  CompletedRoomsActions,
} from './my-rooms.actions';

@Injectable()
export class MyRoomsEffects {
  private actions$ = inject(Actions);
  private myRoomsService = inject(MyRoomsService);

  // this handles actions of type : [MyRooms/Joined] Load
  // with a payload
  // this event is triggered when my rooms component loads
  loadJoinedRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(JoinedRoomsActions.load),
      switchMap((action) =>
        this.myRoomsService.getJoinedRooms(action.userId).pipe(
          map((rooms) => JoinedRoomsActions.loadSuccess({ rooms })),
          catchError((error) =>
            of(
              JoinedRoomsActions.loadFailure({
                error: error.message || 'Failed to load joined rooms',
              })
            )
          )
        )
      )
    );
  });

  loadSavedRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SavedRoomsActions.load),
      switchMap((action) =>
        this.myRoomsService.getSavedRooms(action.userId).pipe(
          map((rooms) => SavedRoomsActions.loadSuccess({ rooms })),
          catchError((error) =>
            of(
              SavedRoomsActions.loadFailure({
                error: error.message || 'Failed to load saved rooms',
              })
            )
          )
        )
      )
    );
  });

  loadCompletedRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompletedRoomsActions.load),
      switchMap((action) =>
        this.myRoomsService.getCompletedRooms(action.userId).pipe(
          map((rooms) => CompletedRoomsActions.loadSuccess({ rooms })),
          catchError((error) =>
            of(
              CompletedRoomsActions.loadFailure({
                error: error.message || 'Failed to load completed rooms',
              })
            )
          )
        )
      )
    );
  });
}
