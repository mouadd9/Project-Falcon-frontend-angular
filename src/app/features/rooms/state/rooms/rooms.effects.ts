import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, delay } from 'rxjs/operators';
import { RoomService } from '../../services/room.service';
import { RoomsActions } from './rooms.actions';



@Injectable()
export class RoomsEffects {
  private actions$ = inject(Actions);
  private roomService = inject(RoomService);

  // this handles actions of type : [MyRooms/Joined] Load
  // with a payload
  // this event is triggered when my rooms component loads
  loadRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoomsActions.load),
      switchMap((action) =>
        this.roomService.getAllRooms(action.userId).pipe(
          map((rooms) => RoomsActions.loadSuccess({ rooms })),
          catchError((error) =>
            of(
              RoomsActions.loadFailure({
                error: error.message || 'Failed to load joined rooms',
              })
            )
          )
        )
      )
    );
  });
}
