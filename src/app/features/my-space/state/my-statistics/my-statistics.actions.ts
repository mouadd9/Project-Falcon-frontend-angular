import { createAction, props } from '@ngrx/store';
import { ProfileStatistics } from '../../../../core/models/statistics.model';

export const loadProfileStatistics = createAction(
  '[Profile Statistics Page] Load Profile Statistics'
);

export const loadProfileStatisticsSuccess = createAction(
  '[Statistics API] Load Profile Statistics Success',
  props<{ statistics: ProfileStatistics }>()
);

export const loadProfileStatisticsFailure = createAction(
  '[Statistics API] Load Profile Statistics Failure',
  props<{ error: any }>() 
);