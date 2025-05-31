import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { RoomsActions } from './rooms.actions';
import { RoomService } from '../../../../core/services/room.service';

@Injectable()
export class RoomsEffects {
  private actions$ = inject(Actions);
  private roomService = inject(RoomService);

  loadRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoomsActions.load),
      switchMap((action) => {
        const hasSearchTerm = action.criteria?.searchTerm && action.criteria.searchTerm.length > 0;
        const debounceMs = hasSearchTerm ? 300 : 50;
        return of(action).pipe(
          debounceTime(debounceMs)
        );
      }),
      switchMap((action) => this.roomService.getAllRooms(action.userId, action.criteria).pipe(
          map((rooms) => RoomsActions.loadSuccess({ rooms })),
          catchError((error) =>
            of(
              RoomsActions.loadFailure({
                error: error.message || 'Failed to load rooms',
              })
            )
          )
        )
      )
    );
  });

  updateFilterCriteria$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoomsActions.updateFilterCriteria),
      // This could trigger a new load with the updated criteria
      // For now, we'll let the component handle the re-loading
      map(() => ({ type: 'NO_OP' }))
    );
  }, { dispatch: false });
}
