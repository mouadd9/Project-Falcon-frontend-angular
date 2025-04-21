// rooms.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MyRoomsService } from '../services/my-rooms.service';
import {
    JoinedRoomsActions,
    SavedRoomsActions,
    CompletedRoomsActions,
  } from './my-rooms.actions';

@Injectable()
export class MyRoomsEffects {
  constructor(
    private actions$: Actions,
    private myRoomsService: MyRoomsService
  ) {}

  // Assuming you have the userId available from auth state
  // For simplicity, I'll hardcode a userId here
  private userId = 1; // Replace with actual user ID from auth state

  loadJoinedRooms$ = createEffect(() => 
    this.actions$.pipe(
      ofType(JoinedRoomsActions.load),
      switchMap(() => 
        this.myRoomsService.getJoinedRooms(this.userId).pipe(
          map(rooms => JoinedRoomsActions.loadSuccess({ rooms })),
          catchError(error => of(JoinedRoomsActions.loadFailure({ 
            error: error.message || 'Failed to load joined rooms' 
          })))
        )
      )
    )
  );

  loadSavedRooms$ = createEffect(() => 
    this.actions$.pipe(
      ofType(SavedRoomsActions.load),
      switchMap(() => 
        this.myRoomsService.getSavedRooms(this.userId).pipe(
          map(rooms => SavedRoomsActions.loadSuccess({ rooms })),
          catchError(error => of(SavedRoomsActions.loadFailure({ 
            error: error.message || 'Failed to load saved rooms' 
          })))
        )
      )
    )
  );

  loadCompletedRooms$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CompletedRoomsActions.load),
      switchMap(() => 
        this.myRoomsService.getCompletedRooms(this.userId).pipe(
          map(rooms => CompletedRoomsActions.loadSuccess({ rooms })),
          catchError(error => of(CompletedRoomsActions.loadFailure({ 
            error: error.message || 'Failed to load completed rooms' 
          })))
        )
      )
    )
  );
}