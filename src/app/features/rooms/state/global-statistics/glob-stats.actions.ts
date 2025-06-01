import { createAction, props } from '@ngrx/store';
import { GlobalRoomStats } from '../../../../core/models/statistics.model';

export const loadGlobalStatistics = createAction(
  '[Global Statistics Banner] Load Global Statistics'
);

export const loadGlobalStatisticsSuccess = createAction(
  '[Statistics API] Load Global Statistics Success',
  props<{ statistics: GlobalRoomStats }>()
);

export const loadGlobalStatisticsFailure = createAction(
  '[Statistics API] Load Global Statistics Failure',
  props<{ error: any }>()
);