import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as MyStatisticsActions from './my-statistics.actions';
import { StatisticsService } from '../../../../core/services/statistics.service';

@Injectable()
export class MyProfileStatisticsEffects {
  private actions$ = inject(Actions);
  private statisticsService = inject(StatisticsService);

  loadProfileStatistics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyStatisticsActions.loadProfileStatistics),
      mergeMap(() =>
        this.statisticsService.getProfileStatistics().pipe(
          map((statistics) => MyStatisticsActions.loadProfileStatisticsSuccess({ statistics })),
          catchError((error) => of(MyStatisticsActions.loadProfileStatisticsFailure({ error })))
        )
      )
    );
  });
}
