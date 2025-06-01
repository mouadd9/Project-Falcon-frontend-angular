import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as GlobalStatsActions from './glob-stats.actions';
import { StatisticsService } from '../../../../core/services/statistics.service';

@Injectable()
export class GlobalStatisticsEffects {
  private actions$ = inject(Actions);
  private statisticsService = inject(StatisticsService);

  loadGlobalStatistics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalStatsActions.loadGlobalStatistics),
      mergeMap(() =>
        this.statisticsService.getGlobalRoomStatistics().pipe(
          map((statistics) => GlobalStatsActions.loadGlobalStatisticsSuccess({ statistics })),
          catchError((error) => of(GlobalStatsActions.loadGlobalStatisticsFailure({ error })))
        )
      )
    );
  });
}
